const initialState = {
	idArray: [],
    dataArray: [],
    modalData: []
}

const reducer = ( state = initialState, action ) => {
	// alert(action.type + " / " + action.payload);
	switch (action.type) {
    case "idArray_update":
      return {
        ...state,
        idArray: action.payload
      };
    case "dataArray_update":
      return {
        ...state,
        dataArray: action.payload
      };
    case "modalData_update":
      // alert("modalData_update");
      return {
        ...state,
        modalData: action.payload
      };
    case "isGuest":
      return {
        ...state,
        isGuest: action.payload
      };
    default:
      // alert("Error in [Reducer.js]");
      return state;
  }
};

export default reducer;