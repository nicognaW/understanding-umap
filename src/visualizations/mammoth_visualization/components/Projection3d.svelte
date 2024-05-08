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

  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  import { loadData } from "../js/load-data";
  import { COLORS } from "../js/colors";

  const dispatch = createEventDispatcher();

  let container;
  let scatterGL;
  let isOrbiting = true;

  export let colorIndices;
  export let mammoth3d;
  export let title = "";
  export let hoveredPointIndex = -1;

  function handleMouseout() {
    dispatch("hover", -1);
  }

  const toggleOrbit = () => {
    isOrbiting = true;
    scatterGL.startOrbitAnimation();
  };

  onMount(async () => {
    const dataset = {
      dimensions: 3,
      points: mammoth3d,
      metadata: []
    };

    const onCameraMove = () => {
      if (isOrbiting) isOrbiting = false;
    };

    const styles = {
      fog: { enabled: false },
      point: { scaleHover: 3.5, colorHover: "rgba(0,0,0,1)" }
    };

    scatterGL = new ScatterGL(container, {
      styles,
      selectEnabled: false,
      onCameraMove,
      onHover: d => {
        if (d === null || d === hoveredPointIndex) return;
        dispatch("hover", d);
      }
    });
    window.scatterGLObj = scatterGL;

    scatterGL.setPointColorer(i => {
      const colorIndex = colorIndices[i];
      return COLORS[colorIndex];
    });
    scatterGL.render(dataset);
  });

  afterUpdate(() => {
    // debugger
    scatterGL.setHoverPointIndex(hoveredPointIndex);
  });
</script>

<style>
  .container {
    width: 45%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    margin-bottom: 20px;
    position: relative;
  }

  .scatter-gl-container {
    width: 100%;
    min-height: 500px;
  }

  @media only screen and (max-width: 800px) {
    .container {
      width: 100%;
      margin-bottom: 0;
    }

    .scatter-gl-container {
      min-height: 300px;
    }
  }

  .title {
    text-align: center;
    width: 100%;
    font-weight: bold;
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

<div class="container" on:mouseout={handleMouseout}>
  {#if title}
    <div class="title">{title}</div>
  {/if}
  <div class="scatter-gl-container" bind:this={container} />
  {#if !isOrbiting}
    <div class="orbit" on:click={toggleOrbit}>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M7.47 21.5C4.2 19.94 1.86 16.76 1.5 13H0c.5 6.16 5.66 11 11.95 11l.66-.03l-3.81-3.81zm.89-6.54c-.19 0-.36-.03-.52-.08a1.1 1.1 0 0 1-.4-.24c-.11-.1-.2-.22-.26-.37c-.06-.14-.09-.3-.09-.47h-1.3c0 .36.07.7.21.95s.33.5.56.69c.24.18.51.32.82.41q.45.15.96.15c.37 0 .72-.05 1.03-.15c.32-.1.6-.25.83-.44s.42-.41.55-.72c.13-.29.2-.61.2-.97c0-.19-.02-.38-.07-.56c-.05-.16-.12-.35-.23-.51c-.1-.15-.24-.3-.4-.43c-.17-.13-.37-.22-.61-.31a2.07 2.07 0 0 0 .89-.75c.1-.16.17-.3.22-.46s.07-.32.07-.48q0-.54-.18-.96c-.14-.26-.29-.51-.51-.69c-.2-.19-.47-.33-.77-.43C9.05 8.05 8.71 8 8.34 8c-.34 0-.69.05-1 .16c-.3.11-.57.26-.79.45c-.21.19-.38.39-.51.67c-.12.26-.18.54-.18.85h1.3q0-.255.09-.45a.94.94 0 0 1 .25-.34c.11-.09.23-.17.38-.22s.3-.08.48-.08c.4 0 .7.1.89.31c.19.2.29.49.29.86c0 .18-.04.34-.08.49a.87.87 0 0 1-.25.37c-.11.1-.25.18-.41.24s-.36.09-.58.09h-.77v1.03h.77c.22 0 .42.02.6.07s.33.13.45.23c.12.11.23.24.29.4c.07.16.1.37.1.57c0 .41-.12.72-.35.93c-.23.23-.55.33-.95.33m8.55-5.92c-.32-.33-.7-.59-1.14-.77c-.43-.18-.92-.27-1.46-.27h-2.36v8h2.3c.55 0 1.06-.09 1.51-.27s.84-.43 1.16-.76s.58-.73.74-1.19c.17-.47.26-.99.26-1.57v-.4c0-.58-.09-1.1-.26-1.57c-.16-.47-.43-.87-.75-1.2m-.41 3.16c0 .42-.03.8-.12 1.13c-.1.33-.24.62-.43.85s-.45.41-.71.53q-.435.18-.99.18h-.91V9.12h.97c.72 0 1.27.23 1.64.69c.38.46.55 1.12.55 1.99M11.95 0l-.66.03l3.81 3.81l1.33-1.34c3.27 1.56 5.61 4.73 5.96 8.5h1.5c-.5-6.16-5.65-11-11.94-11"/></svg>
    </div>
  {/if}
</div>
