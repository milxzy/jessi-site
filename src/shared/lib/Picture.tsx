import type { ImgHTMLAttributes } from 'react'
import type { Img } from '../commerce'
import { srcSet } from '../data/images'

// a bare img with the right size attributes and srcset. no styling: concepts pass their own class.
export function Picture({ img, sizes = '100vw', priority = false, alt, ...rest }: { img: Img; sizes?: string; priority?: boolean } & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>) {
  return (
    <img
      src={img.url}
      srcSet={srcSet(img)}
      sizes={img.smallUrl ? sizes : undefined}
      width={img.width}
      height={img.height}
      alt={alt ?? img.altText}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      // react 18 passes the lowercase attribute through untouched
      {...(priority ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
      {...rest}
    />
  )
}
