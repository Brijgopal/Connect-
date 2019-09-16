import {
    POST_CREATING,
    POST_CREATED,
    POSTS_FETCHING,
    POSTS_FETCHED,
    POST_ERROR,
    POST_SELECTED,
    POST_UNSELECTED,
    POST_DETAILS_FETCHING,
    POST_REACTIONS_FETCHED,
    POST_COMMENTS_FETCHED,
} from '../types';
import isEmpty from '../../validation/isEmpty';

const initialState = {
    showLoader: false,
    success: null,
    activePost: {},
    list: [],
    pstPgCtr: 1,
    rxnPgCtr: 1,
    cmtPgCtr: 1,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case POST_CREATING:
        case POSTS_FETCHING:
        case POST_DETAILS_FETCHING:
            return {
                ...state,
                showLoader: true,
                success: null,
            };

        case POST_CREATED:
            return {
                ...state,
                success: true,
                showLoader: false,
            };

        case POSTS_FETCHED:
            if (!isEmpty(action.payload))
                return {
                    ...state,
                    success: true,
                    pstPgCtr: state.pstPgCtr + 1,
                    list: [...state.list, ...action.payload],
                };
            else return state;

        case POST_SELECTED:
            return {
                ...state,
                activePost: state.list[action.payload],
            };

        case POST_UNSELECTED:
            return {
                ...state,
                activePost: {},
            };

        case POST_REACTIONS_FETCHED:
            if (!isEmpty(action.payload))
                return {
                    ...state,
                    success: true,
                    rxnPgCtr: state.rxnPgCtr + 1,
                    activePost: {
                        ...state.activePost,
                        rxnList: [...state.activePost.rxnList, ...action.payload],
                    },
                };
            else return state;

        case POST_COMMENTS_FETCHED:
            if (!isEmpty(action.payload))
                return {
                    ...state,
                    success: true,
                    cmtPgCtr: state.cmtPgCtr + 1,
                    activePost: {
                        ...state.activePost,
                        cmtList: [...state.activePost.cmtList, ...action.payload],
                    },
                };
            else return state;

        case POST_ERROR:
            return {
                ...state,
                success: false,
                showLoader: false,
            };

        default:
            return state;
    }
}
