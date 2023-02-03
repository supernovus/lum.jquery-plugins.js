# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2023-02-02
### Added
- A `$` property to the `Plugin` constructor.
### Fixed
- Any plugins using `$()` or `$.foo()` are now using `const $ = Plugin.$` first
  to ensure they have a valid version of jQuery.

## [1.0.0] - 2022-10-13
### Added
- Initial release.

[Unreleased]: https://github.com/supernovus/lum.jquery-plugins.js/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/supernovus/lum.jquery-plugins.js/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/supernovus/lum.jquery-plugins.js/releases/tag/v1.0.0
