import React from 'react';
import { Icons, Modal, colors, typography, SearchBox, SearchBoxThemes, scrollbars } from '../index';
import _ from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SnippetIconWrapper = styled.div`
  cursor: pointer;
`;

const ModalTitle = styled.h3`
  color: ${colors.black90};
  ${typography.title};
`;

const SnippetBlock = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  
  &:hover {
      background-color: ${colors.lighterGray};
  }
  
  cursor: pointer;
`;

const SnippetsArea = styled.div`
  overflow-y: scroll;
  max-height: 400px;
  ${scrollbars.darkScrollbar};
`;

const SnippetsTitle = styled.h4`
  color: ${colors.black90};
  ${typography.subhead1};
  margin-bottom: 5px;
`;

const SnippetsBody = styled.p`
  color: ${colors.black60};
  ${typography.body1};
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  margin-bottom: 10px;
`;

const SnippetsHotkey = styled.p`
  color: ${colors.black40};
  ${typography.subhead3};
`;

class SnippetButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      searchText: '',
    };
  }

  cleanTextForPreview = (text) => {
    const div = document.createElement('div');
    div.innerHTML = text;
    const innerText = div.innerText;

    return innerText.replace(/\s+/g, ' ').trim();
  }

  doesSnippetMatch = (snippet, searchText) => {
    const searchTextLower = _.trim(searchText).toLowerCase();
    const name = _.get(snippet, 'name', '').toLowerCase();
    const body = _.get(snippet, 'content', '').toLowerCase();

    return name.includes(searchTextLower) || body.includes(searchTextLower);
  }

  getFilteredSnippets = (snippets, searchText) => {
    if (searchText.length === 0) { return snippets; }

    return _.filter(snippets, snippet => this.doesSnippetMatch(snippet, searchText));
  }

  onSearch = (value) => {
    this.setState({
      searchText: value
    });
  };

  render() {
    const filteredSnippets = this.getFilteredSnippets(this.props.snippets, this.state.searchText);

    return (
      <div>
        <SnippetIconWrapper onClick={() => { this.setState({ modalOpen: true }); }}>
          <Icons.FormatQuote fill={colors.grayC} />
        </SnippetIconWrapper>
        {
          this.state.modalOpen &&
          <Modal onModalBackgroundClick={() => { this.setState({ modalOpen: false }); }}>
            <div>
              <ModalTitle>Insert Snippet</ModalTitle>
              <div>
                <SearchBox searchText={this.state.searchText} theme={SearchBoxThemes.lightTheme} onChange={this.onSearch} placeholder={'Search'} />
              </div>
              <SnippetsArea>
                {
                  _.map(filteredSnippets, snippet =>
                    <SnippetBlock
                      key={snippet.id}
                      onClick={() => {
                        this.setState({ modalOpen: false });
                        this.props.onSnippetClick(_.get(snippet, 'content'));
                      }}>
                      <SnippetsTitle>{snippet.name}</SnippetsTitle>
                      <SnippetsBody>{this.cleanTextForPreview(snippet.content)}</SnippetsBody>
                      <SnippetsHotkey>{_.get(snippet, 'hotKeys.hotKeys', '')}</SnippetsHotkey>
                    </SnippetBlock>
                  )
                }
              </SnippetsArea>
            </div>
          </Modal>
        }
      </div>
    );
  }
}

SnippetButton.propTypes = {
  onSnippetClick: PropTypes.func,
  snippets: PropTypes.object
};

export default SnippetButton;
