import React from 'react';
import { app, firestore} from '../../base';
import toastr from 'reactjs-toastr';
import 'reactjs-toastr/lib/toast.css';
import {Link} from 'react-router-dom';
import { Spinner } from '@blueprintjs/core';

import Table from './components/table/table.view';
import './home.style.css';

const uid = null;

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cells: window.innerWidth / 30,
            selectedCells: [],
            selectedCellModal: '',
            persons: [],
            selectedPerson: '',
            isDataLoading: false,
            loading: true
        };
    }

    componentDidMount() {
        // this.updateWindowDimensions();
        if(app.auth().currentUser !== null) 
            this.uid = app.auth().currentUser.uid;
        this.getPersons()
            .then(data => {
                this.setState({isDataLoading: false, persons: data});
                if(data.length !== 0) {

                    let selectedPerson = data[0].id;
                    this.setState({selectedPerson})
                    this.personSelect(selectedPerson);
                }
            });
        // window.addEventListener('resize', this.updateWindowDimensions);

    }


    componentWillUnMount() {
       
    }

    // updateWindowDimensions() {
    //     this.setState({
    //         cells: window.innerWidth / 80
    //     });
    // }

    getPersons = () => {
        this.setState({isDataLoading: true});
        let _this = this;
        const data = [];
        let colRef = `users/${this.uid}/persons`;
        return firestore
            .collection(colRef)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    // let item = `<option key=${doc.id}>${doc.data().name}</option>`
                    data.push({
                        id: doc.id,
                        name: doc
                            .data()
                            .name
                    });
                })
                _this.setState({loading: false})
                return data;
            })
            .catch(err => {
                console.error(err);
            })
    }

    personSelect = (id) => {
        const data = [];
        let colRef = `users/${this.uid}/persons/${id}/tasks`;
        firestore
            .collection(colRef)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    let {location, value, description} = doc.data();
                    data.push({id: doc.id, location, value, description});
                })
                this.setState({selectedCells: data, loading: false})
            })
            .catch(err => {
                console.error(err);
            })

    }

    // componentWillUnmount() {     window.removeEventListener('resize',
    // this.updateWindowDimensions); }

    handleChangeSelectedCellModals = location => {
        this.setState({selectedCellModal: location})
    }

    handleChangeSelectedCell = (location, value, description, id) => {
        const getIndex = this
            .state
            .selectedCells
            .findIndex(x => x.location === location);

        if (getIndex !== -1) {

            let newValues = this.state.selectedCells;
            newValues[getIndex].value = value;
            newValues[getIndex].description = description;
            newValues[getIndex].selected = false;
            this.updateTask(id, location, value, description);
            
            this.setState({selectedCells: newValues});
            return;
        }
        if (value === '' && description === '') {
            return;
        }

        this.setState({
            selectedCells: [
                ...this.state.selectedCells, {
                    location,
                    value,
                    description,
                    selected: false
                }
            ]
        })
        this.saveTask(location, value, description);

    }

    updateTask = (id, location, value, description) => {
        // console.log("ID: ",id,",Location: ", location,", Value : ",value,"Desc: ",description)
        let docRef = `users/${this.uid}/persons/${this.state.selectedPerson}/tasks/${id}`;
        firestore.doc(docRef).set({location, value, description})
        .then(() => {
            toastr.success('Task Updated successfully','Success',{displayDuration: 1000})
        })
        .catch(err => {
            console.error(err);
        })
    }

    saveTask = (location, value, description) => {
        let colRef = `users/${this.uid}/persons/${this.state.selectedPerson}/tasks`;
        firestore.collection(colRef).add({location, value, description})
        .then(() => {
            // console.log('Item Saved', data)
            toastr.success('Task Saved successfully','Success',{displayDuration: 1000})
        })
        .catch(err => {
            console.error(err);
        })
    }

    handleEditClick(location) {
        this.setState({selectedCellModal: location})
    }

    handleDeleteClick(location) {
        const getIndex = this
            .state
            .selectedCells
            .findIndex(x => x.location === location);
        let newValues = this.state.selectedCells;
        let docId = newValues[getIndex].id;
        let docRef = `users/${this.uid}/persons/${this.state.selectedPerson}/tasks/${docId}`;
        firestore.doc(docRef).delete().then(()=> {
            newValues.splice(getIndex, 1);
            this.setState({selectedCells: newValues})
            toastr.success('Task Deleted successfully','Success',{displayDuration: 1000})
        }).catch(function(error) {
            toastr.error(error.message,error.code,{displayDuration: 1000})
            console.error("Error removing document: ", error);
        });
        
    }

    render() {
        
        // if(this.state.loading === true) {
        //     return (
        //       <div style={{ textAlign: "center", position: "absolute", top: "25%", left: "50%"}} >
        //         <h3>Loading...</h3>
        //       </div>
        //     )
        // }
        const {persons, isDataLoading} = this.state;
        return (
            <div className="root">
               
                <div className="container mb-4 px-4">
                    <select
                        className="form-control"
                        style={{
                        maxWidth: '300px'
                        }}
                        onChange={(e) => {
                        this.setState({selectedPerson: e.target.value});
                        this.personSelect(e.target.value)
                        }}>
                        {isDataLoading && <option>Loading data...</option>
}
                        {!isDataLoading && (persons.length !== 0)
                            ? persons.map(item => <option key={item.id} value={item.id}>{item.name}</option>)
                            : <option>No data found, Add an Item</option>
}
                    </select>
                    <div className="add-user-wrap" style={{width: '100%' ,textAlign: 'right'}}>
                        <Link className="btn btn-primary" to="/user" >Add New User</Link>
                    </div>
                </div>

                {
                    this.state.loading ?
                    <div style={{ textAlign: "center", position: "absolute", top: "25%", left: "50%"}} >
                        <h3>Loading...</h3>
                        <Spinner />
                    </div>:
                    <section>
                    <div className="flex-container">
                    {
                        this.state.persons.length === 0 &&
                        <div className="overlay" onClick={()=> {toastr.warning('No person Found','Please add a user first',{displayDuration: 1000})}}>
                        </div>
                    }
                    <div className="flex-item w-50">
                        <Table
                            handleChangeSelectedCell={this.handleChangeSelectedCell}
                            color="orange"
                            cells={10}
                            row={6}
                            columns={10}
                            float={'right'}
                            data={this.state.selectedCells}
                            selectedModal={this.state.selectedCellModal}
                            handleChangeSelectedCellModals={this.handleChangeSelectedCellModals}/>
                        <Table
                            handleChangeSelectedCell={this.handleChangeSelectedCell}
                            color="purple"
                            cells={10}
                            row={-1}
                            columns={10}
                            float={'right'}
                            data={this.state.selectedCells}
                            selectedModal={this.state.selectedCellModal}
                            handleChangeSelectedCellModals={this.handleChangeSelectedCellModals}/>
                    </div>
                    <div className="flex-item w-50">
                        <Table
                            color="blue"
                            cells={10}
                            row={6}
                            columns={-1}
                            float={'left'}
                            data={this.state.selectedCells}
                            handleChangeSelectedCell={this.handleChangeSelectedCell}
                            selectedModal={this.state.selectedCellModal}
                            handleChangeSelectedCellModals={this.handleChangeSelectedCellModals}/>
                        <Table
                            color="red"
                            cells={10}
                            row={-1}
                            columns={-1}
                            float={'left'}
                            data={this.state.selectedCells}
                            handleChangeSelectedCell={this.handleChangeSelectedCell}
                            selectedModal={this.state.selectedCellModal}
                            handleChangeSelectedCellModals={this.handleChangeSelectedCellModals}/>
                    </div>
                </div>

                <div className="data-container">
                <h2>Data Entered</h2>
                <br/> 
                {
                    this.state.selectedCells.length === 0 && <p>No Data entered yet</p>
                }
                {
                    this.state.selectedCells.length !== 0 && 
                <table className="data table table-striped">
                    <thead>
                        <tr>
                            <th>Location</th>
                            <th>Value</th>
                            <th>Description</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this
                            .state
                            .selectedCells
                            .map((item) => {
                                return (
                                    <tr key={item.id}>
                                        <td className="location">{item.location}</td>
                                        <td className="value">{item.value}</td>
                                        <td className="description">{item.description}</td>
                                        <td>
                                            <button
                                                className="btn btn-info"
                                                onClick={this
                                                .handleEditClick
                                                .bind(this, item.location)}>Edit</button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={this
                                                .handleDeleteClick
                                                .bind(this, item.location)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                }
                </div>
                </section>

                }
                

               
            </div>

        )
    }

}

export default Home;