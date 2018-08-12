import { reducer, initialState, State } from './search.reducer';
import { LoadSearchResults, ChangeSearchTextQuery } from '../actions/search.actions';
import { IThreadSearchResult } from '../../../shared/models/search';
import { IEmail } from '../../../shared/models/message';

describe('[Core] Search Reducer', () => {
  describe('LoadSearchResults', () => {
    it('should change state to loading', () => {
      const actual = reducer(
        initialState,
        new LoadSearchResults({
          page: 1
        })
      );

      expect(actual).toMatchSnapshot();
    });
  });

  describe('ChangeSearchTextQuery', () => {
    it('should chnage search line in the query', () => {
      const state: State = {
        selected: null,
        entities: {
          id1: <IThreadSearchResult<IEmail>>{ id: 'id1', subject: 'Hello world!' }
        },
        ids: ['id1'],
        loading: false,
        total: 1,
        page: 1,
        limit: 10,
        searchQuery: {
          from: null,
          to: [],
          date_from: null,
          date_to: null,
          query: null
        }
      };

      const actual = reducer(
        state,
        new ChangeSearchTextQuery({
          query: 'Hello world'
        })
      );

      expect(actual).toMatchSnapshot();
    });
  });
});
