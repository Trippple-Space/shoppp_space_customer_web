
export type ImageSrcFolder = 'icons' | 'logos' | 'images'
export const getImageDir = ( folder: ImageSrcFolder, object: string) => {
    if (object.indexOf('http') === 0) return object;
    return `/images/${folder}/${object}`
}
