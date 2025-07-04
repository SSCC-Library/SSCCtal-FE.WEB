import InputField from './input_field';
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
			<select
				className="search-filter"
				value={search_type}
				onChange={(e) => set_search_type(e.target.value)}
			>
				{filter_options.map((opt) => (
					<option value={opt.value} key={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</div>
	);
}

export default SearchBar;
