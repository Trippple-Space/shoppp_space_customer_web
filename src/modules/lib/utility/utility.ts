import classNames from "classnames";

export type ImageSrcFolder = 'icons' | 'logos' | 'images'
export const getImageDir = ( folder: ImageSrcFolder, object: string) => {
    if (object.indexOf('http') === 0) return object;
    return `/images/${folder}/${object}`
}

export const getQueryStringFromObject = (object: Record<string, string>) => {
    return new URLSearchParams(object).toString()
}

export const cx = (...args: classNames.ArgumentArray) => {
    return classNames(...args);
}
