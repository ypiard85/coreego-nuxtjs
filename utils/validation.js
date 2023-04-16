export const rules = {
   localisation: { validator: validatorLocalisation , tigger: ['blur', 'change'] }
}

const validatorLocalisation = (rule, value, callback) => {
   console.log(value)
   if(value.length){
      return callback()
   }else{
      callback(new Error('Veuillez selectionnez une adresse'))
   }
}
