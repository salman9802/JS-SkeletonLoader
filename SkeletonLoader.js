
/*
    For line: element is parent and we generate lines
    For cover: we replace it with a div with same classes document.getElementById(ele).getAttribute('class')
*/

/*
    element: id of element in DOM REQUIRED

    type: cover, line REQUIRED
    width: width of loader OPTIONAL DEFAULT 100%
    height: height of loader OPTIONAL DEFAULT 100%

    animation.type: blink shimmer OPTIONAL DEFAUT blink
    animation.duration: duration of animation in (ms) OPTIONAL DEFAULT 1000ms

    startClr: starting color of loader OPTIONAL DEFAULT
    endClr: end color of loader OPTIONAL DEFAULT
    lineCount: No. of lines OPTIONAL DEFAULT 1
    spaceBetween: space between lines OPTIONAL DEFAULT .25rem
*/

class SkeletonLoader {
    static possibleTypes = ['cover', 'line'];
    static possibleAnimations = ['blink', 'shimmer'];


    constructor({ selector, type, lineCount, width, height, spaceBetween, animation, startClr, endClr, lastLine}) {
        let element;

        // Validations
        try {
            if(typeof selector !== 'string' && !(selector instanceof String)) throw new Error(`Id of selector as a string required. "${selector}" given`);
            element = document.querySelector(selector);
            if(!element) throw new Error(`Element not found. Invalid selector '${selector}'`);
            if(!SkeletonLoader.possibleTypes.includes(type)) throw new Error(`Invalid type. No type "${type}"`);
            if(width !== undefined && !width.match(/^[0-9]{1,3}.{1,2}$/)) throw new Error(`Invalid width "${width}" given`);
            if(height !== undefined && !height.match(/^[0-9]{1,3}.{1,2}$/)) throw new Error(`Invalid height "${height}" given`);
            // if(spaceBetween !== undefined && !spaceBetween.match(/^([0-9]*\.?[0-9]*.{1,3})$/)) throw new Error(`Invalid spaceBetween value, "${spaceBetween}" given`);
            if(animation?.duration && !animation.duration.match(/^[0-9]+(s|ms)$/)) throw new Error(`Invalid animation.duration "${animation.duration}" given`);
            if( startClr !== undefined && (typeof startClr !== 'string' && !(startClr instanceof String))) throw new Error(`Invalid startClr ${startClr} given`);
            if( endClr !== undefined && (typeof endClr !== 'string' && !(endClr instanceof String))) throw new Error(`Invalid endClr ${endClr} given`);
            
        } catch (error) {
            console.warn(error);
            return;
        }

        // Defaults
        if(lineCount == undefined || isNaN(lineCount)) lineCount = 1;
        if(!spaceBetween) spaceBetween = '0 0 .25rem 0';

        if(animation === undefined || (typeof animation !== 'object' && Array.isArray(animation))) animation = {};
        animation.type = (animation?.type && SkeletonLoader.possibleAnimations.includes(animation.type)) ? animation.type : 'blink';
        animation.duration = animation?.duration ? animation.duration : '1000ms';

        if(lastLine === undefined || (typeof lastLine !== 'object' && Array.isArray(lastLine))) lastLine = {};
        lastLine.width = lastLine?.width ? lastLine.width : '80%';
        lastLine.height = lastLine?.height ? lastLine.height : '100%';
        lastLine.spaceBetween = lastLine?.spaceBetween ? lastLine.spaceBetween : '0 auto 0 auto';

        if(animation.type === 'blink'){
            startClr = startClr === undefined ? 'hsl(200, 20%, 70%)' : startClr;
            endClr = endClr === undefined ? 'hsl(200, 20%, 95%)' : endClr;
        } else if(animation.type === 'shimmer'){
            startClr = startClr === undefined ? '#eaeaea' : startClr;
            endClr = endClr === undefined ? 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0))' : endClr;
        }

        this.selector = selector;
        this.element = element;
        this.type = type;
        this.lineCount = lineCount;
        this.width = width === undefined ? '100%' : width;
        if(type === 'line'){
            // this.width = width === undefined ? '100%' : width;
            this.height = height === undefined ? '100%' : height;
        }else if(type === 'cover'){
            // this.width = width === undefined ? '100%' : width;
            this.height = height === undefined ? '.8em' : height;
        }

        this.spaceBetween = spaceBetween;
        this.animation = animation; // TODO use spread operator for default config
        this.startClr = startClr;
        this.endClr = endClr;
        this.lastLine = lastLine;

        this.styleElem = document.createElement('style');


        // Skeleton Styless
        if(this.animation.type === 'blink'){
            this.styles = `
                @keyframes skeleton-${this.animation.type} {
                    0% {
                        background-color: ${this.startClr};
                    }
                    100% {
                        background-color: ${this.endClr});
                    }
                }`;
            this.styles += `
            ${this.selector}${ this.type === 'line' ? ' > ' : ''}.skeleton {
                width: ${this.width};
                height: ${this.height};
                opacity: 0.7;
                animation: skeleton-${this.animation.type} ${this.animation.duration} linear infinite alternate;
            }`;
        } else if(this.animation.type === 'shimmer') {
            this.styles = `${this.selector}${ this.type === 'line' ? ' > ' : ''}.skeleton::after {
                content: "";
                position: absolute;
                inset: 0;
                transform: translateX(-100%);
                background-image: ${this.endClr};
                animation: skeleton-shimmer 1s infinite;
            }
            @keyframes skeleton-shimmer {
                100%{transform: translateX(100%);}
            }`;
            this.styles += `
            ${this.selector}${ this.type === 'line' ? ' > ' : ''}.skeleton {
                width: ${this.width};
                height: ${this.height};
                position: relative;
                transition: transform 200ms ease-in-out;
                background-color: ${this.startClr};
                overflow: hidden;
            }`;
        }

            if(this.type === 'line')
                this.styles += `
                ${this.selector} > .skeleton--line {
                    width: ${this.width};
                    height: ${this.height};
                    margin: ${this.spaceBetween};
                    border-radius: .125rem;
                }
                ${this.selector} > .skeleton--line:last-of-type {
                    height: ${this.lastLine.height};
                    margin: ${this.lastLine.spaceBetween};
                    width: ${this.lastLine.width};
                }`;

        // Skeleton animation styles
        
        // Setting Skeleton Element
        this.styleElem.innerHTML = this.styles;
        document.body.appendChild(this.styleElem);

        this.start();
    }

    start() {
        if(this.type === 'cover'){
            this.element.classList.add('skeleton');
            // this.element.classList.add(`skeleton-${this.animation.type}`);
        } else if (this.type === 'line'){
            for(let i = 0; i < this.lineCount; i++){
                const line = document.createElement('div');
                line.classList.add('skeleton');
                line.classList.add('skeleton--line');
                this.element.appendChild(line);
            }
        }
    }

    stop() {
        // this.element.classList.remove('skeleton');
        // this.element.classList.remove(`skeleton-${this.animation.type}`);

        const elements = document.querySelectorAll(this.selector);
        elements.forEach(ele => {
            ele.classList.remove('skeleton');
            ele.classList.remove(`skeleton-${this.animation.type}`);
        });

        document.body.removeChild(this.styleElem);
    }
}


// new SkeletonLoader({
//     selector: '.user__avatar',
//     type: 'cover',
//     width: '100px'
// });

// new SkeletonLoader({
//     selector: '.user__avatar',
//     type: 'cover',
//     width: '100%',
//     animation: {
//         type: 'blink'
//     }
// });
// new SkeletonLoader({
//     selector: '.user__avatar',
//     type: 'cover',
//     width: '100%',
//     animation: {
//         type: 'shimmer'
//     },
//    // startClr: 'darkgray'
// });

// new SkeletonLoader({
//     selector: '.user__info',
//     type: 'line',
//     lineCount: 3,
//     height: '100%',
//     spaceBetween: '0 .25rem 0 .25rem'
// });
// new SkeletonLoader({
//     selector: '.user__info',
//     type: 'line',
//     lineCount: 3,
//     height: '100%',
//     spaceBetween: '0 .25rem 0 .25rem',
//     animation: {
//         type: 'shimmer'
//     }
// });

// new SkeletonLoader({
//     selector: '.user__details',
//     type: 'line',
//     lineCount: 5,
// });
// new SkeletonLoader({
//     selector: '.user__details',
//     type: 'line',
//     lineCount: 5,
//     animation: {
//         type: 'shimmer'
//     }
// });

export { SkeletonLoader };