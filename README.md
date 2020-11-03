# behaveplus-radical

This is the developmental repository for `behaveplus-radical`, an ES6 Javascript clean-room redesign and reimplementation of the mathematical models contained in the *BehavePlus Wildland Fire Modeling System* (v6).

# Summary

`behaveplus-radical` is a wildland fire modeling engine that runs in Node.js or in a web browser.  Its intended use if for the development of applications (like BehavePlus) whose audiences are fire behavior researchers, Fire Behavior Analysts, and other expert users.

`behaveplus-radical` implements the mathematical models enshrined in the *BehavePlus Wildland Fire Modeling System*, which was programmed by Systems for Environmental Management with funding and technical supervision provided by the **USDA Forest Service**. The original BehavePlus is written in C++ and runs only on Windows operating systems. Its latest stable release is Version 5, and the most recent developmental release is Version 6 Alpha Build 626 (2018).

The goal of `behaveplus-radical` is to implement all the features scheduled for BehavePlus Version 6.

# Surface Fuel Model Subsystem

## Features Implemented in Both behaveplus-radical and BehavePlus6

- Standard BEHAVE/FARSITE fuel descriptors (fuel models) per Albini, Anderson, Rothermel, and Scott & Burgan can be specified as either:
  - a key (code or number) to a standard fuel model, or
  - individual fuel parameters (aka 'fuel modeling').
- Chaparral fuels can be dynamically estimated from input parameters per Rothermel and Philpot.
- Palmetto-gallberry fuels can be dynamically estimated from input parameters per Hough and Albini.
- Western aspen fuels can be dynamically estimated from input parameters per Brown and Simmerman.
- Two fuel models may be specified for a single surface fire to derive a weighted estimate of fire behavior.

## BehavePlus6 Features Not Yet Implemented in behaveplus-radical

- User-created standard BEHAVE-FARSITE fuel models can be stored in a personal fuel catalog.
- The 'expected value' surface fire behavior weightging method
- The fire containment module (CONTAIN)

## behaveplus-radical Features Not Available in BehavePlus6

- A mixture of any two standard BEHAVE-FARSITE, dynamic chaparral, dynamic palmetto-gallberry, or dynamic western aspen fuel models may be used in weighted fire behavior.

# Design

`behaveplus-radical` is a complete re-design of the core BehavePlus Fire Modeling System:

- its is written in EcmaScript 2015 Javascript instead of C++

- it can be used by Node.js or browser applications instead of an installed Windows app,

- it employs a directed acyclical graph to dynamically determine inputs and an optimized processing order based on the selected outputs and model configurations.
