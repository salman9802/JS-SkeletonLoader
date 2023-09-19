
/*
    For line elmenet is parent and we generate lines
    For cover we replace it with a div with same classes document.getElementById(ele).getAttribute('class')
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


    constructor({ selector, type, lineCount, width, height, spaceBetween, animation, startClr, endClr}) {
        let element;

        // Validations
        try {
            if(typeof selector !== 'string' && !(selector instanceof String)) throw new Error(`Id of selector as a string required. "${selector}" given`);
            element = document.querySelector(selector);
            if(!element) throw new Error(`Element not found. Invalid selector '${selector}'`);
            if(!SkeletonLoader.possibleTypes.includes(type)) throw new Error(`Invalid type. No type "${type}"`);
            if(width !== undefined && !width.match(/^[0-9]{1,3}.{1,2}$/)) throw new Error(`Invalid width "${width}" given`);
            if(height !== undefined && !height.match(/^[0-9]{1,3}.{1,2}$/)) throw new Error(`Invalid height "${height}" given`);
            if(spaceBetween !== undefined && !spaceBetween.match(/^[0-9]*\.?[0-9]*.{1,3}$/)) throw new Error(`Invalid spaceBetween value, "${spaceBetween}" given`);
            if(animation?.duration && !animation.duration.match(/^[0-9]+(s|ms)$/)) throw new Error(`Invalid animation.duration "${animation.duration}" given`);
            if( startClr !== undefined && (typeof startClr !== 'string' && !(startClr instanceof String))) throw new Error(`Invalid startClr ${startClr} given`);
            if( endClr !== undefined && (typeof endClr !== 'string' && !(endClr instanceof String))) throw new Error(`Invalid endClr ${endClr} given`);
            
        } catch (error) {
            console.warn(error);
            return;
        }

        // Defaults
        if(lineCount == undefined || isNaN(lineCount)) lineCount = 1;
        if(animation === undefined || (typeof animation !== 'object' && Array.isArray(animation))) animation = {};
        animation.type = (animation?.type && possibleAnimations.includes(animation.type)) ? animation.type : 'blink';
        animation.duration = animation?.duration ? animation.duration : '1000ms';
        startClr = startClr === undefined ? 'hsl(200, 20%, 70%)' : startClr;
        endClr = endClr === undefined ? 'hsl(200, 20%, 95%)' : endClr;

        this.selector = selector;
        this.element = element;
        this.type = type;
        this.lineCount = lineCount;
        if(type === 'line'){
            this.width = width === undefined ? '100%' : width;
            this.height = height === undefined ? '100%' : height;
        }
        this.spaceBetween = spaceBetween;
        this.animation = animation; // TODO use spread operator for default config
        this.startClr = startClr;
        this.endClr = endClr;

        this.styleElem = document.createElement('style');


        // Skeleton Styless
        this.styles = `
        ${this.selector}.skeleton {
            opacity: 0.7;
            animation: skeleton-${this.animation.type} ${this.animation.duration} linear infinite alternate;
        }`;
        // Skeleton animation styles
        this.styles += `
        @keyframes skeleton-${this.animation.type} {
            0% {
                background-color: ${this.startClr};
            }
            100% {
                background-color: ${this.endClr});
            }
        }`;
        // Setting Skeleton Element
        this.styleElem.innerHTML = this.styles;

        this.start();
    }

    start() {
        this.element.classList.add('skeleton');
        this.element.classList.add(`skeleton-${this.animation.type}`);
        
        // let styles = `
        // ${this.selector}.skeleton {
        //     opacity: 0.7;
        //     animation: skeleton-${this.animation.type} ${this.animation.duration} linear infinite alternate;
        // }`;

        // styles += `
        // @keyframes skeleton-${this.animation.type} {
        //     0% {
        //         background-color: ${this.startClr};
        //     }
        //     100% {
        //         background-color: ${this.endClr});
        //     }
        // }`;


        // const styleElem = document.createElement('style');
        // styleElem.innerHTML = styles;

        // document.body.appendChild(styleElem);
    }

    stop() {
        // this.element.classList.remove('skeleton');
        // this.element.classList.remove(`skeleton-${this.animation.type}`);
        const elements = document.querySelectorAll(this.selector);
        elements.forEach(ele => {
            ele.classList.remove('skeleton');
            ele.classList.remove(`skeleton-${this.animation.type}`);
        });
    }
}


// new SkeletonLoader({
//     selector: '.user__avatar',
//     type: 'cover',
//     width: '100px'
// });

export { SkeletonLoader };