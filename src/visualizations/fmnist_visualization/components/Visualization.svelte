<script>
  /* Copyright 2019 Google LLC All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  ==============================================================================*/

  import { onMount } from "svelte";
  import { loadData } from "../js/load-data";
  import Color from "color";

  let container;
  let data;
  let metadata;
  let colorsByLabel;
  let isLoaded = false;
  let isUmapProjection = true;
  let selectedLabelIndices = new Set();
  let scatterGL;

  let umapDataset;
  let tsneDataset;

  let isOrbiting = true;

  const onPointClick = i => {
    const labelIndex = i === null ? null : metadata[i].labelIndex;
    onCategoryClick(labelIndex)();
  };

  window._selectFmnistLabel = (e, label) => {
    const labelIndex = data.labelNames.findIndex(l => {
      return l.toLowerCase() === label;
    });
    if (labelIndex !== -1) {
      onCategoryClick(labelIndex)(e);
    }
  };

  const onCategoryClick = index => e => {
    if (e && e.shiftKey) {
      selectedLabelIndices.add(index);
    } else {
      selectedLabelIndices.clear();
    }
    if (index !== null) {
      selectedLabelIndices.add(index);
    }

    // Necessary to force a rerender of the category labels
    selectedLabelIndices = selectedLabelIndices;

    if (selectedLabelIndices.size === 0) return setDefaultPointColorer();
    scatterGL.setPointColorer(i => {
      const labelIndex = metadata[i].labelIndex;
      return selectedLabelIndices.has(labelIndex)
        ? colorsByLabel[labelIndex].string()
        : "white";
    });
  };

  const setDefaultPointColorer = () => {
    scatterGL.setPointColorer(i => {
      const labelIndex = metadata[i].labelIndex;
      return colorsByLabel[labelIndex].string();
    });
  };

  const getBackgroundColor = (labelIndex, selectedLabelIndices) => {
    const isSelected = selectedLabelIndices.has(labelIndex);
    const noneSelected = selectedLabelIndices.size === 0;
    const color = colorsByLabel[labelIndex];
    return isSelected || noneSelected
      ? color.string()
      : color.lighten(0.35).string();
  };

  const toggleUmapSelected = umapSelected => () => {
    isUmapProjection = umapSelected;
    if (isUmapProjection) {
      scatterGL.updateDataset(umapDataset);
    } else {
      scatterGL.updateDataset(tsneDataset);
    }
  };

  const toggleOrbit = () => {
    isOrbiting = true;
    scatterGL.startOrbitAnimation();
  };

  onMount(async () => {
    data = await loadData();
    isLoaded = true;

    metadata = [];
    const umapPoints = [];
    const tsnePoints = [];

    data.umapProjection.forEach((vector, index) => {
      const labelIndex = data.labels[index];
      umapPoints.push([vector[2], vector[0], vector[1]]);
      const tsneVector = data.tsneProjection[index];
      tsnePoints.push(tsneVector);
      metadata.push({
        labelIndex,
        label: data.labelNames[labelIndex]
      });
    });

    const dataset = {
      dimensions: 3,
      metadata,
      spriteMetadata: {
        spriteImage: "spritesheet.png",
        singleSpriteSize: [28, 28]
      }
    };

    umapDataset = {
      ...dataset,
      points: umapPoints
    };

    tsneDataset = {
      ...dataset,
      points: tsnePoints
    };

    colorsByLabel = [...new Array(10)].map((_, i) => {
      let hue = Math.floor((360 / 10) * i);
      return new Color({ h: hue, s: 100, l: 70 });
    });

    const onCameraMove = () => {
      if (isOrbiting) isOrbiting = false;
    };

    scatterGL = new ScatterGL(container, {
      renderMode: "SPRITE",
      camera: { zoom: 1.3 },
      selectEnabled: false,
      onClick: onPointClick,
      onCameraMove
    });
    setDefaultPointColorer();
    scatterGL.render(umapDataset);
  });
</script>

<style>
  .container {
    position: relative;
    width: 100%;
    min-height: 500px;
  }

  .scatter-gl-container {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .categories {
    height: 100%;
    width: 20%;
    position: absolute;
    right: 0;
  }

  .category {
    cursor: pointer;
    margin-bottom: 10px;
    padding: 8px;
    user-select: none;
    color: #333;
  }

  .category.selected {
    font-weight: 800;
  }

  .category:hover {
    text-decoration: underline;
  }

  .projection-types {
    position: absolute;
    top: 0;
    left: 0;
    width: 150px;
    flex-direction: column;
  }

  .projection-type {
    cursor: pointer;
    background-color: aliceblue;
    margin-bottom: 10px;
    padding: 8px;
    user-select: none;
  }

  .projection-type:hover {
    text-decoration: underline;
  }

  .projection-type.selected {
    font-weight: 900;
  }

  .orbit {
    position: absolute;
    bottom: 0;
    left: 0;
    cursor: pointer;
  }
  .orbit:hover {
    color: #333;
  }
</style>

<div class="container">
  <div class="scatter-gl-container" bind:this={container} />
  <div class="projection-types">
    <div
      class="projection-type {isUmapProjection ? 'selected' : ''}"
      on:click={toggleUmapSelected(true)}>
      UMAP
    </div>
    <div
      class="projection-type {isUmapProjection ? '' : 'selected'}"
      on:click={toggleUmapSelected(false)}>
      t-SNE
    </div>
  </div>
  <div class="categories">
    {#if isLoaded}
      <div
        class="category {selectedLabelIndices.size === 0 ? 'selected' : ''}"
        style="background-color: aliceblue"
        on:click={onCategoryClick(null)}>
        All
      </div>
      {#each data.labelNames as labelName, labelIndex}
        <div
          class="category {selectedLabelIndices.has(labelIndex) ? 'selected' : ''}"
          style="background-color: {getBackgroundColor(labelIndex, selectedLabelIndices)}"
          on:click={onCategoryClick(labelIndex)}>
          {labelName}
        </div>
      {/each}
    {/if}
  </div>
  {#if !isOrbiting}
    <div class="orbit" on:click={toggleOrbit}>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M7.47 21.5C4.2 19.94 1.86 16.76 1.5 13H0c.5 6.16 5.66 11 11.95 11l.66-.03l-3.81-3.81zm.89-6.54c-.19 0-.36-.03-.52-.08a1.1 1.1 0 0 1-.4-.24c-.11-.1-.2-.22-.26-.37c-.06-.14-.09-.3-.09-.47h-1.3c0 .36.07.7.21.95s.33.5.56.69c.24.18.51.32.82.41q.45.15.96.15c.37 0 .72-.05 1.03-.15c.32-.1.6-.25.83-.44s.42-.41.55-.72c.13-.29.2-.61.2-.97c0-.19-.02-.38-.07-.56c-.05-.16-.12-.35-.23-.51c-.1-.15-.24-.3-.4-.43c-.17-.13-.37-.22-.61-.31a2.07 2.07 0 0 0 .89-.75c.1-.16.17-.3.22-.46s.07-.32.07-.48q0-.54-.18-.96c-.14-.26-.29-.51-.51-.69c-.2-.19-.47-.33-.77-.43C9.05 8.05 8.71 8 8.34 8c-.34 0-.69.05-1 .16c-.3.11-.57.26-.79.45c-.21.19-.38.39-.51.67c-.12.26-.18.54-.18.85h1.3q0-.255.09-.45a.94.94 0 0 1 .25-.34c.11-.09.23-.17.38-.22s.3-.08.48-.08c.4 0 .7.1.89.31c.19.2.29.49.29.86c0 .18-.04.34-.08.49a.87.87 0 0 1-.25.37c-.11.1-.25.18-.41.24s-.36.09-.58.09h-.77v1.03h.77c.22 0 .42.02.6.07s.33.13.45.23c.12.11.23.24.29.4c.07.16.1.37.1.57c0 .41-.12.72-.35.93c-.23.23-.55.33-.95.33m8.55-5.92c-.32-.33-.7-.59-1.14-.77c-.43-.18-.92-.27-1.46-.27h-2.36v8h2.3c.55 0 1.06-.09 1.51-.27s.84-.43 1.16-.76s.58-.73.74-1.19c.17-.47.26-.99.26-1.57v-.4c0-.58-.09-1.1-.26-1.57c-.16-.47-.43-.87-.75-1.2m-.41 3.16c0 .42-.03.8-.12 1.13c-.1.33-.24.62-.43.85s-.45.41-.71.53q-.435.18-.99.18h-.91V9.12h.97c.72 0 1.27.23 1.64.69c.38.46.55 1.12.55 1.99M11.95 0l-.66.03l3.81 3.81l1.33-1.34c3.27 1.56 5.61 4.73 5.96 8.5h1.5c-.5-6.16-5.65-11-11.94-11"/></svg>
    </div>
  {/if}
</div>
