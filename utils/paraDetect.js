export const toCheck = (function() {
    return {
      // add js-invalid-para class to all invalid para element
      toAddClass: function(validLength, className) {
        let invalidChildNodes = document.querySelectorAll(
          "." + className + " table p , ." + className + "ul p" , "." + className + "p>img" 
        );
  
        [].forEach.call(invalidChildNodes, child => {
          child.classList.add("js-invalid-para");
        });
  
        return this.getValidNodes(validLength, className);
      },
  
      getValidNodes: function(validLength, className) {
        // to select all not invalid para element
        let validPara = document.querySelectorAll(
          "." + className + " p:not(.js-invalid-para)"
        );
        let validAry = [];
        //validAry contain para with length greater than the valid length
        [].forEach.call(validPara, child => {
          child.innerText.length > validLength ? validAry.push(child) : "";
        });
  
        //returns the validAry
  
        return validAry;
      }
    };
  })();
  