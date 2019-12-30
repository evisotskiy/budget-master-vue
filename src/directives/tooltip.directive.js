import localizeFilter from "@/filters/localize.filter";

export default {
  bind(el, { value, modifiers }) {
    global.M.Tooltip.init(el, {
      html: modifiers.noloc ? value : localizeFilter(value)
    });
  },
  unbind(el) {
    const tooltip = global.M.Tooltip.getInstance(el);
    tooltip && tooltip.destroy && tooltip.destroy();
  }
};
