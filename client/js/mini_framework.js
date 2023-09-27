/**
 * Alann Schnebelen
 * Mini-framework (mf), is a mini js framework to help with web app dev.
 * 
 *  You will be able to:
 *      -Create an element
 *      -Create an event
 *      -Nest elements
 *      -Add attributes to an element
 *      -Use routing system
 *      -Use state management system
 */

const _updaters = new Map();

const _routs = {}

window.addEventListener('hashchange', () => {
    if (_routs[window.location.hash]) {
        _routs[window.location.hash]();
    }
})


const mn =  {
    id: (id)=>document.getElementById(id),
    /**Insert HTMLElement From JS file */

    /**
     * @typedef {} OldElementUpdaterFunction
     */
    /**
     * @param {HTMLOrSVGScriptElement} parentElement_script 
     * @param {{
    *   (updater: Function, old_element_updater: {(old_element_updater: Array<HTMLElement>) => Function}) => Array<HTMLElement>
    * }} createElements 
    */

    insert:
        (parentElement_script, createElements) => {
            /**@type {Array<HTMLElement>}*/
            var els = []
            const updater = () => {
                const newElement = createElements(updater, old_updater)
                for (const el of els) {
                    el.remove()
                }
                for (const el of newElement) {
                    parentElement_script.insertAdjacentElement("beforebegin", el)
                }
                els = newElement
            }
            const old_updater = (f) => {
                return () => {
                    const oldElement = els;
                    f(oldElement)
                }
            }
            els = createElements(updater, old_updater)
            const insert = () => {
                for (const el of els) {
                    parentElement_script.insertAdjacentElement("beforebegin", el)
                }
            }
            insert()
            // window.addEventListener("load", insert, {once: true})
            // console.log("data", data);
        },
    /**Element is a virtual element of your DOM*/
    element: {
        create: function (tag, props, ...children) {
            /**@type {HTMLElement} */
            const element = document.createElement(tag);

            if (props) {
                for (const [attr, value] of Object.entries(props)) {
                    if (attr.startsWith('on')) {
                        const eventType = attr.substring(2).toLowerCase();
                        element.addEventListener(eventType, value);
                    } else {
                        element.setAttribute(attr, value);
                    }
                }
            }

            for (const child of children) {
                if (typeof child === 'string') {
                    element.innerHTML += child;
                } else {
                    if (!child) { continue }
                    element.append(child);
                }
            }
            return element;
        },
    },
    /**Root is the management of your url endpoint to handle action*/
    rout: {
        create: function (path, handler) {
            _routs[path] = handler
        },
        remove: function (path) {
            delete _routs[path]
        },
    },
    /**State is variable they will be usable everyware in your framework*/
    data: {
        set: function (key, value) {
            index(data, key, value);
        },
        get: function (key) {
            return index(data, key);
        },
        update: function (key, fValue = v=>v) {
            mn.data.set(key, fValue(mn.data.get(key)))
            const onKey = _updaters.get(key);
            if (onKey) {
                for (const updater of onKey.keys()) {
                    updater();
                }
            }
        },
        /**
         * @typedef {(old_element_updater: Array<HTMLElement>) => Function} OldElementUpdaterFunction
         */
        /**
         * @param {string} key 
         * @param {OldElementUpdaterFunction} updater 
         */
        bind: function (key, updater) {
            // Get or create a Set for the updater functions associated with the key
            const onKey = _updaters.get(key) || new Set();

            // Add the updater function to the Set
            onKey.add(updater);

            // Update the Map with the Set of updater functions
            _updaters.set(key, onKey);
        },
        remove_bind: function (key, updater) {
            // Get or create a Set for the updater functions associated with the key
            const onKey = _updaters.get(key);

            if (onKey && onKey.has(updater)) {
                onKey.delete(updater)
            }
        }
    },
    /**Field the body with node param*/
    init: (...nodes) => {
        document.body.append(...nodes)
    },
}


function index(obj,is, value) {
    if (typeof is == 'string')
        return index(obj,is.split('.'), value);
    else if (is.length==1 && value!==undefined)
        return obj[is[0]] = value;
    else if (is.length==0)
        return obj;
    else
        return index(obj[is[0]],is.slice(1), value);
}
