export const initialState = {
    provider: null,
    signer: null,
    freelanceTokenContract: null,
    freelanceContractAddress: null,
    currentAddress: null,
    escrowAddress: '',
    freelancer: '',
    client: '',
    arbiter: '',
    submissionDeadline: '',
    escrowContract: '',
    balance: null,
    fileUrl: null,
  };
  
  export const reducerBlock = (state, action) => {
    switch (action.type) {
      case 'SET_PROVIDER':
        return { ...state, provider: action.payload };
      case 'SET_SIGNER':
        return { ...state, signer: action.payload };
      case 'SET_FREELANCE_TOKEN_CONTRACT':
        return { ...state, freelanceTokenContract: action.payload };
      case 'SET_FREELANCE_CONTRACT_ADDRESS':
        return { ...state, freelanceContractAddress: action.payload };
      case 'SET_CURRENT_ADDRESS':
        return { ...state, currentAddress: action.payload };
      case 'SET_ESCROW_ADDRESS':
        return { ...state, escrowAddress: action.payload };
      case 'SET_FREELANCER':
        return { ...state, freelancer: action.payload };
      case 'SET_CLIENT':
        return { ...state, client: action.payload };
      case 'SET_ARBITER':
        return { ...state, arbiter: action.payload };
      case 'SET_SUBMISSION_DEADLINE':
        return { ...state, submissionDeadline: action.payload };
      case 'SET_ESCROW_CONTRACT':
        return { ...state, escrowContract: action.payload };
      case 'SET_BALANCE':
        return { ...state, balance: action.payload };
      case 'SET_FILE_URL':
        return { ...state, fileUrl: action.payload };
      default:
        return state;
    }
  };
  
  export default { initialState, reducerBlock };
  