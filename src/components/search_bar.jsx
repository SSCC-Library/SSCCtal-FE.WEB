/*
검색바 컴포넌트
- InputField + FilterDropDown 조합
*/

import InputField from './input_field';
import FilterDropDown from './filter_dropdown';
import './search_bar.css';

function SearchBar({
	filter_options,
	search_type,
	set_search_type,
	search_text,
	set_search_text,
	on_search,
}) {
	return (
		<div className="search-bar-wrap">
			<InputField
				type="text"
				value={search_text}
				onChange={(e) => set_search_text(e.target.value)}
				placeholder="검색어를 입력하세요"
				onSearch={on_search}
			/>
			<FilterDropDown
				filter_options={filter_options}
				value={search_type}
				onChange={set_search_type}
			/>
		</div>
	);
}

export default SearchBar;
