# SSPOC

Sparse Sensor Placement Optimization for Classification

This package implements the sparse sensor placement optimization for classification (SSPOC) algorithm.

## Installation

```bash
uv sync --extra dev
```

## Usage

```python
import numpy as np
from sspoc import pca_lda, sspoc, lda_n, classify_nearest_centroid

# Load your data
# X: n_measurements x n_samples
# G: class labels (1 x n_samples)

# Extract features using PCA-LDA
w, Psi, centroid = pca_lda(X, G, n_features=20)

# Find sparse sensor locations
s = sspoc(Psi, w, lambda_=0.1)

# Select sensors (non-zero elements of s)
sensors = np.where(np.abs(s) >= np.linalg.norm(s) / len(np.unique(G)) / 20 / 2)[0]

# Create measurement matrix
Phi = np.zeros((len(sensors), X.shape[0]))
for i, sensor in enumerate(sensors):
    Phi[i, sensor] = 1

# Train classifier on sparse measurements
w_sparse = lda_n(Phi @ X, G)

# Classify data
predictions = classify_nearest_centroid(X, Phi, w_sparse, centroid)
```

## Citation

If you use this code in your work, please cite the original publication:

Brunton, Bing. "Sparse sensor placement optimization for classification." arXiv preprint arXiv:1310.4217 (2013).

## License

MIT License - see LICENSE file for details.