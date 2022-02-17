const validations = {
  email(val) {
    let text = true;
    const emailRegex = new RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    );
    if (val.trim().length > 100 || !emailRegex.test(val)) {
      if (val.trim().length > 100) text = 'Email must not contain more than 100 characters.';
      else text = 'Please enter a valid email.';
    }
    return text;
  },
  password(val) {
    let text = true;
    if (val.trim().length < 4 || val.trim().length > 100) {
      text = 'The value must be atleast 6 characters long and not more than 100 characters.';
    }
    return text;
  },
  mobile(val, abroad = false) {
    let text = true;
    const phnRegex = abroad ? new RegExp(/(^[1-9]\d{0,14}$)/) : new RegExp(/(^[6-9]\d{0,9}$)/);
    if (!(phnRegex.test(val)) || (!abroad && (val.trim()).length < 10)) {
      text = 'Please enter a valid mobile number';
    }
    return text;
  },
  name(val) {
    let text = true;
    const nameRegex = new RegExp(/^[a-zA-Z ]*$/);
    if ((val.trim()).length > 100 || (val.trim()).length < 2 || !(nameRegex.test(val))) {
      if ((val.trim()).length < 2) text = 'Name must contain atleast 2 characters';
      else if ((val.trim()).length > 100) text = 'Name must not contain more than 100 characters';
      else { text = 'Name can contain only alphabets and space.'; }
    }
    return text;
  },
  text(val) {
    let text = true;
    if ((val.trim()).length < 2) {
      text = 'Please enter atleast 2 characters';
    }
    return text;
  },
  select(val) {
    let text = true;
    val = (val?.toString()) || '';
    if ((val.trim()) == '') {
      text = 'Please select a valid value.';
    }
    return text;
  },
  textarea(val) {
    let text = true;
    if ((val.trim()).length < 1) {
      text = 'Field is required';
    } else if ((val.trim()).length >= 1 && (val.trim()).length < 20) {
      text = 'Input is too short';
    }
    return text;
  },
  textareaWithLength(val, len) {
    let text = true;
    if ((val.trim()).length < 1) {
      text = 'Field is required';
    } else if ((val.trim()).length >= 1 && (val.trim()).length < 10) {
      text = 'Input is too short';
    } else if (val.length > len) {
      text = 'Input is too Long';
    }
    return text;
  },
  required: function(val){
    let text = true;
    if((val.trim()).length < 1){
      text = "Field is required";
    } 
    return text;
  }
};

export default validations;
