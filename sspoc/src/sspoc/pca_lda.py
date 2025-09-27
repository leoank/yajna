"""PCA followed by LDA for feature extraction."""

import numpy as np
from .lda import lda_n


def pca_lda(X: np.ndarray, G: np.ndarray, n_features: int = 10) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    PCA followed by LDA for feature extraction and classification.

    Parameters
    ----------
    X : np.ndarray
        Raw data matrix, n by m where n is number of measurements per sample,
        m is number of samples.
    G : np.ndarray
        Group/class labels for each sample, 1 by m vector.
    n_features : int, optional
        Number of features to use in discrimination.

    Returns
    -------
    tuple[np.ndarray, np.ndarray, np.ndarray]
        w : LDA vectors learned in classification, n_features by (c-1) matrix
        Psi : Feature basis used in classification, n by n_features matrix
        centroid : Centroid of each class in w space, (c-1) by c matrix
                   useful for nearest centroid classification
    """
    # Compute feature basis Psi using SVD (PCA)
    U, _, _ = np.linalg.svd(X, full_matrices=False)
    Psi = U[:, :n_features]

    # Project data onto feature space
    a = Psi.T @ X

    # Apply LDA
    w, _ = lda_n(a, G)

    # Project data into classifier space
    X_cls = w.T @ a

    # Compute centroids of each class in classifier space
    classes = np.unique(G)
    c = len(classes)
    centroid = np.zeros((c-1, c))

    for i, cls in enumerate(classes):
        mask = G == cls
        centroid[:, i] = np.mean(X_cls[:, mask], axis=1)

    return w, Psi, centroid