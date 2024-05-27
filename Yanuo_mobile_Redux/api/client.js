import axios from "axios";
import {REACT_APP_API_URL} from '../constants/index';

export default axios.create({baseURL: REACT_APP_API_URL});