"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * getYesterday returns date object from yesterday
 */
exports.getYesterday = () => {
    let date = new Date();
    return date.setDate(date.getDate() - 1);
};
//# sourceMappingURL=utils.js.map