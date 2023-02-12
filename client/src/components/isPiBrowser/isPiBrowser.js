export default function isPiBrowser () {
   const check = window.navigator.userAgent.indexOf('PiBrowser')
    if (check===-1) return false;
    else return true;
}