"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
// This mock simply renders the `defs` in place.
const SvgDefsMock = ({ id, children }) => (React.createElement("defs", { id: id }, children));
exports.default = SvgDefsMock;
//# sourceMappingURL=SVGDefs.js.map