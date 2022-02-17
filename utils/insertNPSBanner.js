const targetDivs = ['faqs', 'cdcms_faqs'];


// this function is modified, no need to pass argument now.
// you can add className directly to above array.

export const insertNPSBanner = (targetDivClassName = 'faqs') => {
        let fragment;
        let found = false;
        let targetNode;

        for(let target of targetDivs){
             const node = document.querySelector(`.${target}`);
             if(node) targetNode = node;
        };

        if(targetNode instanceof HTMLElement){
            fragment = document.createElement('div');
            found = true;
            targetNode.insertAdjacentElement('beforeBegin', fragment);
        }

        if(found) return {slot:fragment, found};
        else return {found};
}

