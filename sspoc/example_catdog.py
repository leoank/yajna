#!/usr/bin/env python3
"""
SSPOC Example: Cat vs Dog Classification

This script demonstrates the SSPOC algorithm on the CatDog dataset.
It reproduces the functionality from the original MATLAB runme_CatDog.m script.
"""

import numpy as np
import scipy.io
import matplotlib.pyplot as plt
from sspoc import pca_lda, sspoc, lda_n, classify_nearest_centroid


def main():
    """Run the SSPOC example on CatDog data."""
    # Load the CatDog dataset
    data = scipy.io.loadmat('scratch/SSPOC_pub/data/CatDog.mat')
    X = data['X']  # 4096 x 242 matrix (pixels x images)
    G = data['G'].flatten()  # class labels (0 = cat, 1 = dog)
    nx = data['nx'].item()  # horizontal pixels
    ny = data['ny'].item()  # vertical pixels

    n = nx * ny
    classes = np.unique(G)
    c = len(classes)  # number of classes

    print(f"Dataset: {X.shape[1]} images of {n} pixels each")
    print(f"Classes: {c} ({classes})")

    # Analyze singular value spectrum
    U, Sigma, V = np.linalg.svd(X, full_matrices=False)
    dS = np.diag(Sigma) / np.sum(Sigma)

    plt.figure(figsize=(6, 4))
    plt.semilogy(dS[:235], 'k')
    plt.xlabel('i')
    plt.ylabel(r'$\sigma_i$')
    plt.title('Singular Value Spectrum')
    plt.grid(True)
    plt.tight_layout()
    plt.savefig('sspoc_singular_values.png', dpi=150, bbox_inches='tight')
    plt.close()

    # Compute PCA-LDA and SSPOC
    r = 20  # truncate to first r features
    print(f"Extracting {r} features using PCA-LDA...")
    w, Psi, centroid = pca_lda(X, G, n_features=r)

    print("Running SSPOC algorithm...")
    s = sspoc(Psi, w, lambda_=0.1)

    # Select sensors (non-zero elements of s)
    threshold = np.linalg.norm(s) / c / r / 2
    sensors = np.where(np.abs(s) >= threshold)[0]
    q = len(sensors)

    print(f"Selected {q} sparse sensors")

    # Construct sparse measurement matrix Phi
    Phi = np.zeros((q, n))
    for i, sensor in enumerate(sensors):
        Phi[i, sensor] = 1

    # Learn new classifier for sparsely measured data
    print("Training classifier on sparse measurements...")
    w_sspoc, _ = lda_n(Phi @ X, G)

    # Compute centroids for sparse classifier
    X_cls = w_sspoc.T @ (Phi @ X)
    centroid_sparse = np.zeros((c-1, c))
    for i, cls in enumerate(classes):
        mask = G == cls
        centroid_sparse[:, i] = np.mean(X_cls[:, mask], axis=1)

    # Classify data using sparse sensors
    predictions = classify_nearest_centroid(X, Phi, w_sspoc, centroid_sparse)

    # Convert predictions back to original class labels (0-based)
    predictions = predictions - 1

    # Calculate accuracy
    accuracy = np.mean(predictions == G)
    print(".3f")

    # Visualize results
    print("Creating visualization...")
    chi = -Psi @ w

    # Convert sensor indices to image coordinates
    sensors_x = (sensors % ny).astype(int)
    sensors_y = (sensors // ny).astype(int)

    # Create visualization
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

    # Plot 1: Feature vectors and sparse solution
    ax1.plot(chi / np.max(np.abs(chi)), color='gray', alpha=0.7)
    ax1.plot(s / np.max(np.abs(s)), 'r', linewidth=2)
    ax1.set_title('Feature Vectors and Sparse Solution')
    ax1.set_xlabel('Pixel Index')
    ax1.set_ylabel('Normalized Value')
    ax1.grid(True, alpha=0.3)

    # Plot 2: Image with sensor locations
    chi_reshaped = chi.reshape(nx, ny)
    im = ax2.imshow(chi_reshaped, cmap='gray')
    ax2.scatter(sensors_x, sensors_y, c='red', s=50, marker='.', alpha=0.8)
    ax2.set_title(f'Sensor Locations ({q} sensors)')
    ax2.axis('off')

    plt.tight_layout()
    plt.savefig('sspoc_results.png', dpi=150, bbox_inches='tight')
    plt.close()

    print("Results saved to sspoc_results.png and sspoc_singular_values.png")
    print(f"Classification accuracy with {q} sensors: {accuracy:.3f}")


if __name__ == "__main__":
    main()