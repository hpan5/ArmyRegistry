import React from 'react'
import { Field, reduxForm } from 'redux-form'

let SoldierForm = (props) => {
  const { handleSubmit, valid, onCancel } = props
  return (
    <form onSubmit={handleSubmit} >
        <div>
            <label htmlFor="name"> Name: </label>
            <Field name="name" id="name" component={newField} type="text" />
        </div>
        <div>
            <label htmlFor="rank"> Rank: </label>
            <Field name="rank" id="rank" component={newField} type="text" />
        </div>
        <div>
            <label htmlFor="sex"> Sex: </label>
            <label>
              <Field name="sex" component="input" type="radio" value="M" />{' '}
                Male
            </label>
            <label>
              <Field name="sex" component="input" type="radio" value="F" />{' '}
                Famale
            </label>
        </div>
        <div>
            <label htmlFor="phone"> Office Phone: </label>
            <Field name="startDate" id="startDate" component={newField} type="text" />
        </div>
        <div>
            <label htmlFor="email"> Email: </label>
            <Field name="email" id="email" component={newField} type="text" />
        </div>
        <div>
            <label htmlFor="Superior"> Superior: </label>
            <Field name="superior" id="superior" component="select">
              <option />
              <option value="#ff0000">Red</option>
              <option value="#00ff00">Green</option>
              <option value="#0000ff">Blue</option>
            </Field>
        </div>
        <button type="submit" disabled={!valid}> Save </button>
        <button type="button" onClick={onCancel}> Cancel </button>
    </form>
  )
}

const myValidator = values => {
  const errors = {};
  return errors;
};

const newField = ({
  input,
  type,
  placeholder,
  id,
  meta: { touched, error },
  ...rest
}) => {
  return (
    <div>
      <input {...input} placeholder={placeholder} type={type} id={id} />
      {touched && error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

SoldierForm = reduxForm({
  form: 'soldier',
  validate: myValidator,
  enableReinitialize: true
})(SoldierForm)

export default SoldierForm;

