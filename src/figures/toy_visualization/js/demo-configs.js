import * as generators from "./generators";

export const demos = [
  {
    name: "Grid",
    description:
      "A square grid with equal spacing between points. " +
      "Try convergence at different sizes.",
    options: [
      {
        name: "Points Per Side",
        min: 5,
        max: 20,
        start: 10
      }
    ],
    generator: generators.gridData
  },
  {
    name: "Two Clusters",
    description: "Two clusters with equal numbers of points.",
    options: [
      {
        name: "Points Per Cluster",
        min: 10,
        max: 100,
        start: 50
      },
      {
        name: "Dimensions",
        min: 1,
        max: 100,
        start: 2
      }
    ],
    generator: generators.twoClustersData
  },
  {
    name: "Three Clusters",
    description:
      "Three clusters with equal numbers of points, but at " +
      "different distances from each other.",
    options: [
      {
        name: "Points Per Cluster",
        min: 10,
        max: 100,
        start: 50
      },
      {
        name: "Dimensions",
        min: 1,
        max: 100,
        start: 2
      }
    ],
    generator: generators.threeClustersData
  },
  {
    name: "Two Different-Sized Clusters",
    description:
      "Two clusters with equal numbers of points, but different " +
      "variances within the clusters.",
    options: [
      {
        name: "Points Per Cluster",
        min: 10,
        max: 100,
        start: 50
      },
      {
        name: "Dimensions",
        min: 1,
        max: 100,
        start: 2
      },
      {
        name: "Scale",
        min: 1,
        max: 10,
        start: 5
      }
    ],
    generator: generators.twoDifferentClustersData
  },
  {
    name: "Two Long Linear Clusters",
    description:
      "Two sets of points, arranged in parallel lines that " +
      "are close to each other. Note curvature of lines.",
    options: [
      {
        name: "Points Per Cluster",
        min: 10,
        max: 100,
        start: 50
      }
    ],
    generator: generators.longClusterData
  },
  {
    name: "Cluster In Cluster",
    description: "A dense, tight cluster inside of a wide, sparse cluster.",
    options: [
      {
        name: "Points Per Cluster",
        min: 10,
        max: 100,
        start: 50
      },
      {
        name: "Dimensions",
        min: 1,
        max: 100,
        start: 2
      }
    ],
    generator: generators.subsetClustersData
  },
  {
    name: "Circle (Evenly Spaced)",
    description:
      "Points evenly distributed in a circle. " +
      "Hue corresponds to angle in the circle.",
    options: [
      {
        name: "Number Of Points",
        min: 20,
        max: 100,
        start: 50
      }
    ],
    generator: generators.circleData
  },
  {
    name: "Circle (Randomly Spaced)",
    description:
      "Points randomly distributed in a circle. " +
      "Hue corresponds to angle in the circle.",
    options: [
      {
        name: "Number Of Points",
        min: 20,
        max: 100,
        start: 50
      }
    ],
    generator: generators.randomCircleData
  },
  {
    name: "Gaussian Cloud",
    description:
      "Points in a unit Gaussian distribution. " +
      "Data is entirely random, so any visible subclusters are " +
      "not statistically significant",
    options: [
      {
        name: "Number Of Points",
        min: 20,
        max: 500,
        start: 50
      },
      {
        name: "Dimensions",
        min: 1,
        max: 100,
        start: 2
      }
    ],
    generator: generators.gaussianData
  },
  {
    name: "Ellipsoidal Gaussian Cloud",
    description:
      "Points in an ellipsoidal Gaussian distribution. " +
      " Dimension n has variance 1/n. Elongation is visible in plot.",
    options: [
      {
        name: "Number Of Points",
        min: 20,
        max: 500,
        start: 50
      },
      {
        name: "Dimensions",
        min: 1,
        max: 100,
        start: 2
      }
    ],
    generator: generators.longGaussianData
  },
  {
    name: "Trefoil Knot",
    description:
      "Points arranged in 3D, following a trefoil knot. " +
      "Different runs may give different results.",
    options: [
      {
        name: "Number Of Points",
        min: 20,
        max: 200,
        start: 50
      }
    ],
    generator: generators.trefoilData
  },
  {
    name: "Linked Rings",
    description:
      "Points arranged in 3D, on two linked circles. " +
      "Different runs may give different results.",
    options: [
      {
        name: "Number Of Points",
        min: 20,
        max: 200,
        start: 50
      }
    ],
    generator: generators.linkData
  },
  {
    name: "Unlinked Rings",
    description: "Points arranged in 3D, on two unlinked circles",
    options: [
      {
        name: "Number Of Points",
        min: 20,
        max: 200,
        start: 50
      }
    ],
    generator: generators.unlinkData
  },
  {
    name: "Orthogonal Steps",
    description:
      "Points related by mutually orthogonal steps. " +
      "Very similar to a random walk.",
    options: [
      {
        name: "Number Of Points",
        min: 20,
        max: 500,
        start: 50
      }
    ],
    generator: generators.orthoCurve
  },
  {
    name: "Random Walk",
    description: "Random (Gaussian) walk. " + "Smoother than you might think.",
    options: [
      {
        name: "Number Of Points",
        min: 20,
        max: 1000,
        start: 100
      },
      {
        name: "Dimension",
        min: 1,
        max: 1000,
        start: 100
      }
    ],
    generator: generators.randomWalk
  },
  {
    name: "Random Jump",
    description: "Random (Gaussian) Jump",
    options: [
      {
        name: "Number Of Points",
        min: 20,
        max: 1000,
        start: 100
      },
      {
        name: "Dimension",
        min: 1,
        max: 1000,
        start: 100
      }
    ],
    generator: generators.randomJump
  },
  {
    name: "Equally Spaced",
    description:
      "A set of points, where distances between all pairs of " +
      "points are the same in the original space.",
    options: [
      {
        name: "Number Of Points",
        min: 20,
        max: 100,
        start: 50
      }
    ],
    generator: generators.simplexData
  },
  {
    name: "Uniform Distribution",
    description: "Points uniformly distributed in a unit cube.",
    options: [
      {
        name: "Number Of Points",
        min: 20,
        max: 200,
        start: 50
      },
      {
        name: "Dimensions",
        min: 1,
        max: 10,
        start: 3
      }
    ],
    generator: generators.cubeData
  }
];

export const demosByName = {};
demos.forEach((d, i) => {
  d.index = i;
  demosByName[d.name] = d;
});
