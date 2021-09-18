import React, {useEffect} from 'react';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    
  }
}));


const MenuProps = {
    style: {
      maxHeight: 200,
      width: 250,
    }
};

export default function EditPopup({currentUser, setAge1, setFrom1, setRelationship1}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [age, setAge] = React.useState(currentUser.age);
  const [relationship, setRelationship] = React.useState(currentUser.relationship);
  const [city, setCity] = React.useState(currentUser.from);

  const handleChangeAge = (event) => {
    setAge(Number(event.target.value) || '');
  };

  const handleChangeRelationship = (event) => {
    setRelationship(String(event.target.value) || '');
  };

  const handleChangeCity = (event) => {
    setCity(String(event.target.value) || '');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateUser = async() => {

    const body = {
      userId: currentUser._id,
      from: city,
      age: age,
      relationship: relationship
    }

    try {
      await axios.put(`https://damirsbook.herokuapp.com/api/users/${currentUser._id}`, body)
    } catch(err) {
      console.log(err);
    }
    setAge1(age);
    setFrom1(city);
    setRelationship1(relationship);
    handleClose();
  }

  return (
    <span>
      <EditIcon fontSize="small" onClick={handleClickOpen}></EditIcon>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <form className={classes.container}>
          <FormControl className={classes.formControl}>
            <TextField id="standard-basic" label="City" value={city} onChange={handleChangeCity}/>
          </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="demo-dialog-native">Age</InputLabel>
              <Select
                MenuProps={MenuProps}
                native
                value={age}
                onChange={handleChangeAge}
                input={<Input id="demo-dialog-native" />}
              >
                <option value={18}>18</option>
                <option value={19}>19</option>
                <option value={20}>20</option>
                <option value={21}>21</option>
                <option value={22}>22</option>
                <option value={23}>23</option>
                <option value={24}>24</option>
                <option value={25}>25</option>
                <option value={26}>26</option>
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-dialog-select-label">Relationship</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={relationship}
                onChange={handleChangeRelationship}
                input={<Input />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"Single"}>Single</MenuItem>
                <MenuItem value={"In a relationship"}>In a relationship</MenuItem>
                <MenuItem value={"It's complicated"}>It's complicated</MenuItem>
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={updateUser} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}
