export function toggleFilter() {
        document.getElementById("search-filter-dropdown").classList.toggle('active');
        document.getElementById("filter-button").classList.toggle('selected');
        document.getElementById("filter-button").children[0].classList.toggle('fa-chevron-down');
        document.getElementById("filter-button").children[0].classList.toggle('fa-chevron-up');
}
