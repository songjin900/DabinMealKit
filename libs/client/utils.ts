export function cls(...classnames: string[]) {
    return classnames.join(" ");
}

export const getRGBColor = (hex, type) => {
    let color = hex.replace(/#/g, "")
    // rgb values
    var r = parseInt(color.substr(0, 2), 16)
    var g = parseInt(color.substr(2, 2), 16)
    var b = parseInt(color.substr(4, 2), 16)
  
    return `--color-${type}: ${r}, ${g}, ${b};`
  }
  