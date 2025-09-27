"""Linear Discriminant Analysis functions."""

import numpy as np
from scipy.linalg import pinv, eigh


def lda_n(X: np.ndarray, G: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """
    N-way Linear Discriminant Analysis.

    Returns solutions of the generalized eigenvector problem maximizing
    between-class variance and minimizing within-class variance.

    Parameters
    ----------
    X : np.ndarray
        Data matrix, d by n where d is dimensionality, n is number of samples.
    G : np.ndarray
        Vector of class labels for each sample.

    Returns
    -------
    tuple[np.ndarray, np.ndarray]
        w : LDA vectors (eigenvectors), d by (c-1) where c is number of classes
        D : Eigenvalues corresponding to w
    """
    d = X.shape[0]
    classes = np.unique(G)
    c = len(classes)

    # Compute centroids and class sizes
    N = np.zeros(c)
    centroid = np.zeros((d, c))
    for i, cls in enumerate(classes):
        mask = G == cls
        N[i] = np.sum(mask)
        centroid[:, i] = np.mean(X[:, mask], axis=1)

    # Within-class scatter matrix
    Sw = np.zeros((d, d))
    for i, cls in enumerate(classes):
        mask = G == cls
        res = X[:, mask] - centroid[:, i:i+1]
        Sw += res @ res.T

    # Between-class scatter matrix
    Sb = np.zeros((d, d))
    overall_mean = np.mean(X, axis=1, keepdims=True)
    for i, cls in enumerate(classes):
        diff = centroid[:, i:i+1] - overall_mean
        Sb += N[i] * (diff @ diff.T)

    # Solve generalized eigenvalue problem: Sw^-1 * Sb
    # Use eigh for symmetric matrices (more stable than eig)
    eigvals, eigvecs = eigh(pinv(Sw) @ Sb)

    # Sort eigenvalues in descending order and take c-1 largest
    idx = np.argsort(eigvals)[::-1][:c-1]
    w = eigvecs[:, idx]
    D = np.diag(eigvals[idx])

    # Normalize w vectors
    for i in range(w.shape[1]):
        w[:, i] = w[:, i] / np.sqrt(w[:, i] @ w[:, i])

    return w, D