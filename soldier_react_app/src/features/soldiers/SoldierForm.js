import React, { useEffect } from 'react'
import { connect } from 'react-redux';
//import { Field, reduxForm } from 'redux-form'
import { Form, Field } from 'react-final-form'
import { Field as ValidField } from "react-final-form-html5-validation";
import { useSelector, useDispatch } from 'react-redux';
import { fetchSuperiorCandidates } from './SoldiersSlice';
import Select from 'react-select'
import '../../styles/Form.css'

const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    width: state.selectProps.width,
    borderBottom: '1px dotted pink',
    color: state.selectProps.menuColor,
    padding: 20,
  }),

  control: (_, { selectProps: { width }}) => ({
    width: width
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  }
}

let SoldierForm = (props) => {
  const { onSubmit, onCancel } = props
  const dispatch = useDispatch();
  const superiorCandidates = useSelector((state) => state.soldiers.superiorCandidates);
  const editingSoldier = useSelector((state) => state.soldiers.editingSoldier);
  useEffect(() => {
    if (superiorCandidates === undefined || superiorCandidates.length === 0) {
      dispatch(fetchSuperiorCandidates({}));
    }
  }, [dispatch, superiorCandidates]);
//sex: "M", rank: "General"
  return (
    <Form
      validate={myValidator}
      initialValues={editingSoldier ? editingSoldier : {}}
      onCancel={onCancel}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, valid, onCancel }) => (
        <form onSubmit={handleSubmit} >
          <button type="submit" disabled={!valid}> Save </button>
          <button type="button" onClick={onCancel}> Cancel </button>
          <div className="right-container">
            <div className="form_right">
              <div>
                <label htmlFor="name"> *Name: </label>
                <Field name="name" id="name" component={newField} type="text" />
                </div>
              <div>
                <label htmlFor="rank"> *Rank: </label>
                <Field 
                  name="rank" 
                  id="rank" 
                  component={selectField}
                  options={rankOptions}
                />
              </div>
      
              <div>
                <label htmlFor="sex"> Sex: </label>
                <div className="genderBlock">
                  <label>
                    <Field name="sex" component="input" type="radio" value="M" />{' '}
                      Male
                  </label>
                  <label>
                    <Field name="sex" component="input" type="radio" value="F" />{' '}
                      Female
                  </label>
                </div>
              </div>
      
              <div>
                <label htmlFor="startDate"> *Start Date: (dd/mm/yyyy)</label>
                <Field name="startDate" id="startDate" component={newField} type="text" />
              </div>
              
              <div>
                <label htmlFor="phone"> *Office Phone: (xxx-xxx-xxxx) </label>
                <Field name="phone" id="phone" component={newField} type="text" />
              </div>
            
              <div>
                <label htmlFor="email"> *Email: </label>
                <Field name="email" id="email" component={newField} type="text" />
              </div>
            
              <div>
                <label htmlFor="Superior"> Superior: </label>
                <Field 
                  name="superior" 
                  id="superior" 
                  component={selectField}
                  options={superiorCandidates}
                />
              </div>
            </div>
              
          </div>
        </form>
      )

      }
    </Form>
    
  )
}
//{id : candidate.id, name: candidate.name}
const myValidator = values => {
  const errors = {};
  if (!values.name) {
    errors.name = "Name is required";
  }
  if (!values.sex) {
    errors.sex = "Sex is required";
  }
  if (!values.rank || values.rank === "") {
    errors.rank = "Rank is required";
  }
  if (!values.startDate) {
    errors.startDate = "StartDate is required";
  } else if (!/^[0-3]?[0-9].[0-3]?[0-9].(?:[0-9]{2})?[0-9]{2}$/.test(values.startDate)) {
    errors.startDate = "Valid start date is required";
  }//need regex check
  if (!values.phone) {
    errors.phone = "Phone is required";
  }else if (!/\d{3}-\d{3}-\d{4}/.test(values.phone)) {
    errors.phone = "Valid phone format is required";
  } //need regex check
  if (!values.email) {
    errors.email = 'An email is required';
  } else if (!/(.+)@(.+){1,}\.(.+){1,}/i.test(values.email)) {
    // use a more robust RegEx in real-life scenarios
    errors.email = 'Valid email is required';
  }
  //console.log("errors" , errors);
  return errors;
};

const selectField = ({ input, meta: { touched, error }, ...rest }) => (
  <div>
    <Select 
    {...input} 
    {...rest} 
    searchable 
    className="select"/>
    {touched && (error && <span style={{ color: 'red' }}>{error}</span>)}
  </div>
)

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
      {touched && (error && <span style={{ color: 'red' }}>{error}</span>)}
    </div>
  );
};

const rankOptions = [
  {value: "General", label: "General"},
  {value: "Colonel", label: "Colonel"},
  {value: "Major", label: "Major"},
  {value: "Captain", label: "Captain"},
  {value: "Lieutenant", label: "Lieutenant"},
  {value: "Warrant Officer", label: "Warrant Officer"},
  {value: "Sergeant", label: "Sergeant"},
  {value: "Corporal", label: "Corporal"},
  {value: "Specialist", label: "Specialist"},
  {value: "Private", label: "Private"}];

export default SoldierForm;
