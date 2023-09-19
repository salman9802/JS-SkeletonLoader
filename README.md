
# SkeletonLoader: Skeleton Loading Animations using JS

To add skeleton loaders (for templates) on websites.


## Documentation

### Import 
Add script tag in html
```html
<script src="js/SkeletonLoader.js" type="module" defer></script>
```

You can import the SkeletonLoader class
```javascript
import { SkeletonLoader } from "./SkeletonLoader.js";
```

### Types of Loader

Type | Description
---- | -----------
**cover** | Loader covers the entire element specified.
**line** | Loader create `lineCount` line elements inside specified element.

### Types of Animiation

Type | Description
---- | -----------
**blink** | Blinks the element from `startClr` to `endClr`.
**shimmer** | Shimmer animation on element from `startClr` to `endClr`.

### Options

- **selector**: Selector for element.
- **type**: Type of Loader. Required.
- **lineCount**: No. of lines. Defaults to `1`.
- **width**: Width of element. Defaults to `100%`.
- **height**: Height of element. Defaults to `100%` for cover and `.8em` for line.
- **spaceBetween**: Used to specify space around lines. Takes a string value similar to margin property
- **animation**: Animation object for defining animation. Following are the options for `animation`:
    - **type**: Type of animation. Defaults to `blink`. Value should be a valid animation type.
    - **duration**: Duration of animation in milliseconds. Defaults to `1000`.
- **startClr**: Starting Color Value.
- **endClr**: Ending Color Value.
- **lastLine**: Object for styling last line. Following are the options:
    - **width**: Width of element. Defaults to `80%`.
    - **height**: Height of element. Defaults to `100%` for cover and `.8em` for line.
    - **spaceBetween**: Used to specify space around lines. Takes a string value similar to margin property. Defaults to `0 auto 0 auto`.


## Usage/Examples

```javascript
import { SkeletonLoader } from "./SkeletonLoader.js";

new SkeletonLoader({
    selector: '.user__avatar',
    type: 'cover',
    width: '100%',
    animation: {
        type: 'blink'
    }
});
new SkeletonLoader({
    selector: '.user__avatar',
    type: 'cover',
    width: '100%',
    animation: {
        type: 'shimmer'
    },
   // startClr: 'darkgray'
});

new SkeletonLoader({
    selector: '.user__info',
    type: 'line',
    lineCount: 3,
    height: '100%',
    spaceBetween: '0 .25rem 0 .25rem'
});
new SkeletonLoader({
    selector: '.user__info',
    type: 'line',
    lineCount: 3,
    height: '100%',
    spaceBetween: '0 .25rem 0 .25rem',
    animation: {
        type: 'shimmer'
    }
});

new SkeletonLoader({
    selector: '.user__details',
    type: 'line',
    lineCount: 5,
});
new SkeletonLoader({
    selector: '.user__details',
    type: 'line',
    lineCount: 5,
    animation: {
        type: 'shimmer'
    }
});
```


## Authors

- [@salman9802](https://www.github.com/salman9802)

