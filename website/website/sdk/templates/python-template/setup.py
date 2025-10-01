#!/usr/bin/env python3
"""
Setup script for Tau OS Python Application Template
"""

from setuptools import setup, find_packages

setup(
    name="tau-python-app",
    version="0.1.0",
    description="A sample Tau OS application written in Python",
    author="Tau OS Developer",
    author_email="developer@tauos.org",
    packages=find_packages(),
    install_requires=[
        "PyGObject>=3.42.0",
        "tauos-python>=0.1.0",
    ],
    entry_points={
        "console_scripts": [
            "tau-python-app=main:main",
        ],
    },
    python_requires=">=3.8",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
) 