const fs = require('fs')
import { join } from 'path'
import { mkdir, stat, writeFile } from 'fs/promises'
import sharp from 'sharp'

const maybeRemoveOldImage = (fileName: string, url = 'public/') => {
    let oldImagePath = join(url, fileName)

    fs.access(oldImagePath, fs.constants.F_OK, (err: any) => {
        if (err) {
            console.error(err)
            return
        } else {
            fs.unlink(oldImagePath, (err: any) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        }
    })
}

const maybeUploadImage = async (
    params: { [k: string]: FormDataEntryValue },
    file: Blob,
    url: string,
    options?: {
        paramToBeChanged: string,
        customFileName: string,
        isAvatar?: boolean
    }) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    let fileName = options?.customFileName ? options?.customFileName : file.name.toLowerCase().split(' ').join('-')
    const uploadDir = join(process.cwd(), 'public', url)

    try {
        await stat(uploadDir)
    } catch (e: any) {
        if (e.code === "ENOENT") {
            await mkdir(uploadDir, { recursive: true });
        } else {
            console.error("Error while trying to create directory when uploading a file\n", e)
        }
    }

    try {
        if (options?.isAvatar) {
            await sharp(buffer)
                .resize({ width: 300, height: 300, fit: 'cover', withoutEnlargement: true })
                .toFile(`${uploadDir}/${fileName}`, (err, info) => {
                    if (err) console.error('File is not resized.', err)
                })
        }
        else {
            await writeFile(`${uploadDir}/${fileName}`, buffer)
        }

    } catch (e) {
        console.error("Error while trying to upload a file\n", e)
    }
    if (options?.paramToBeChanged) {
        params[options?.paramToBeChanged] = url + fileName
    }
    return params
}

export { maybeRemoveOldImage, maybeUploadImage }