const inicialState = {
  showModalADDCOLLECT: false,
  showModalADDITEM: false,
  showModalEDTCOLLECT: false,
  showModalEDTITEM: false,
  showModalELLIPSIS: false,
  showModalFILTERCOLLECT: false,

};

const reducer = (state = inicialState, action) => {
  switch (action.type) {
    case 'SHOW_MODAL_ADDCOLLECT_ON':
      return {
        ...state,
        showModalADDCOLLECT: true,
      };
    case 'SHOW_MODAL_ADDCOLLECT_OFF':
      return {
        ...state,
        showModalADDCOLLECT: false,
      };
    case 'SHOW_MODAL_EDTCOLLECT_ON':
      return {
        ...state,
        showModalEDTCOLLECT: true,
      };
    case 'SHOW_MODAL_EDTCOLLECT_OFF':
      return {
        ...state,
        showModalEDTCOLLECT: false,
      };
    case 'SHOW_MODAL_EDTITEM_ON':
      return {
        ...state,
        showModalEDTITEM: true,
      };
    case 'SHOW_MODAL_EDTITEM_OFF':
      return {
        ...state,
        showModalEDTITEM: false,
      };
      case 'SHOW_MODAL_ADDITEM_ON':
        return {
          ...state,
          showModalADDITEM: true,
        };
      case 'SHOW_MODAL_ADDITEM_OFF':
        return {
          ...state,
          showModalADDITEM: false,
        };
      case 'SHOW_MODAL_ELLIPSIS_ON':
        return {
          ...state,
          showModalELLIPSIS: true,
        };
      case 'SHOW_MODAL_ELLIPSIS_OFF':
        return {
          ...state,
          showModalELLIPSIS: false,
        };
      case 'SHOW_MODAL_FILTER_COLLECT_ON':
        return {
          ...state,
          showModalFILTERCOLLECT: true,
        };
      case 'SHOW_MODAL_FILTER_COLLECT_OFF':
        return {
          ...state,
          showModalFILTERCOLLECT: false,
        };
        

    default:
      return state;
  }
};

export default reducer;
