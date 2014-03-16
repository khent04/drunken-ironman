//source : https://github.com/es-shims/
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        return object;
    };
}