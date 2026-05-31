+++
title = "Iterators vs Generators in Python"
date = 2024-10-04T00:00:00+08:00
description = "A compact note comparing iterator protocols and generator syntax."
tags = ["python", "demo"]
+++

Python gives us two closely related tools for lazy evaluation: iterators and generators.

## Iterator

An iterator is any object that implements `__iter__()` and `__next__()`.

## Generator

A generator is a compact way to build an iterator with `yield`.

Both are useful, but generators are often the more ergonomic default when you control the data source.
