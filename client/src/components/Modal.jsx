import React from 'react'
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

export const Modal = ({toggle, onChange, roomCreate, tagsChange, tags}) => {
    
    return(
        <div className="overlay">
            <div className="modal-wrapper">
                <div className="content p-4">
                    <div className="input-wrapper">
                        <input type="text" className="form-control" placeholder="Title" id="title" onChange={(e) => onChange(e)}/>
                    </div>
                    <div className="input-wrapper">
                        <TagsInput value={tags} onChange={tagsChange} />
                        
                    </div>
                    <div className="btn-group mt-3" role="group">
                        <button className="btn btn-warning mr-5" onClick={() => roomCreate()}>Create</button>
                        <button className="btn btn-success" onClick={() => toggle()}>Back</button>
                    </div>
                </div>
            </div>
        </div>
    )
}