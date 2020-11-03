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
            <Field name="sex" id="sex" component={newField} type="text" />
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
            <label htmlFor="supervisor"> Supervisor: </label>
            <Field name="supervisor" id="supervisor" component={newField} type="text" />
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
  form: 'user',
  validate: myValidator,
  enableReinitialize: true
})(SoldierForm)

export default SoldierForm;

