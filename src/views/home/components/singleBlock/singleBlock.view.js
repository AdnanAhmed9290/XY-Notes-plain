import React from 'react';
import './singleBlock.css';

class SingleBlock extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: '',
            description: '',
            location: '',
            colored: false,
            id: ''
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            location: props.column+'X'+props.row+'Y'
        })
        const getIndex = props.data.findIndex(x => x.location === props.column+'X'+props.row+'Y');
        if(getIndex !== -1) {
            let { value, description, selected, id} = props.data[getIndex];
            this.setState({id, value, description, selected, colored: true});
        }
        else {
            this.setState( {
                value: '',
                description: '',
                colored: false,
                id: ''
            })
        }

    }

    handleClick = (e) => {
        e.preventDefault();
        const { handleChangeSelectedCellModals } = this.props;
        handleChangeSelectedCellModals(this.props.column+'X'+this.props.row+'Y');
        // this.setState({selected: !this.state.selected})
    }

    handleChange(e) {
        this.setState({ value: e.target.value })
    }

    handleSave = () => {
        // this.setState({selected: !this.state.selected})
        const { handleChangeSelectedCell,handleChangeSelectedCellModals } = this.props;
        const { location, value, description, id } = this.state;
        handleChangeSelectedCell(location, value, description, id);
        handleChangeSelectedCellModals('');
    }

   render() {
       
    const {color, selectedModal} = this.props;
    const isIncluded = selectedModal === this.state.location ;
    return (
        <td className="singleBlock" style={ this.state.selected || this.state.colored || this.state.value !== '' ? {backgroundColor: color}: {}} 
          >
            <div className="td-click-area" onClick={this.handleClick} >&nbsp;</div>
            {/* {this.state.value} */}
            {this.state.value !== '' && 
                    <p style={{fontSize: '0.7em', margin: "0"}}>{this.props.column}X.{this.props.row}Y</p>
                }
            {isIncluded &&
                
                <div className="input-wrapper">

                    <form onSubmit={this.handleSave}>
                        <label>Title</label>
                        <input type="text" autoFocus value={this.state.value} onChange={this.handleChange.bind(this)} required/>
                        
                        <p style={{margin: 0}}>&nbsp;</p>
                        <label>Description</label>
                            <textarea rows="3" value={this.state.description}  onChange={(e)=> {this.setState({description: e.target.value})}} required></textarea>
                        
                        <p style={{margin: 0}}>&nbsp;</p>

                        <button className="btn btn-primary" type="submit">SAVE</button>
                            &nbsp;
                        <button className="btn btn-default" type="button" onClick={()=> {this.props.handleChangeSelectedCellModals('')}}>CANCEL</button>
                    </form>
                    
                </div>
            }
            
        </td>
    )
   }

}


export default SingleBlock;