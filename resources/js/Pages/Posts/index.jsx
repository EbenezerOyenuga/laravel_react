import React from 'react';
import { Link, Head } from '@inertiajs/inertia-react';
import { Component } from 'react';
import axios from 'axios';
import CategoryService from '@/Services/CategoryService';

class PostsIndex extends Component {

    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            categories: [],
            query: {
                page: 1,
                category_id: '',
                order_column: 'id',
                order_direction: 'desc'
            }
        }

        this.categoryChanged = this.categoryChanged.bind(this);
        this.pageChanged = this.pageChanged.bind(this);
        this.orderChanged = this.orderChanged.bind(this);
    }

    fetchPosts(page = 1) {
        axios.get('api/posts', { params: this.state.query })
            .then(response => this.setState({ posts: response.data }))
    }



    componentDidMount() {
        this.fetchPosts()
        CategoryService.getAll().then(response => this.setState({ categories: response.data.data }))

    }

    renderPosts() {
        return this.state.posts.data.map(
            post =>
                <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>{post.title}</td>
                    <td>{post.category.name}</td>
                    <td>{post.content}</td>
                    <td>{post.created_at}</td>
                </tr>
        );
    }

    pageChanged(url) {
        const fullUrl = new URL(url);
        this.setState((
            {
                query: {
                    page: fullUrl.searchParams.get('page')
                }
            }
        ), () => this.fetchPosts())


    }

    categoryChanged(category_id) {

        this.setState((
            {
                query: {
                    category_id: event.target.value,
                    page: 1
                }
            }
        ), () => this.fetchPosts());


    }

    renderPaginator() {
        return (
            <nav role="navigation" aria-label="Pagination Navigation" className="flex items-center justify-between">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700 leading-5">
                            Showing
                            <span>
                                <span className="font-medium"> {this.state.posts.meta.from} </span>
                                to
                                <span className="font-medium"> {this.state.posts.meta.to} </span>
                            </span>
                            of
                            <span className="font-medium"> {this.state.posts.meta.total} </span>
                            results
                        </p>
                    </div>

                    <div>
                        <span className="relative z-0 inline-flex shadow-sm rounded-md">
                            {this.renderPaginatorLinks()}
                        </span>
                    </div>
                </div>
            </nav>
        )
    }

    renderPaginatorLinks() {
        return this.state.posts.meta.links.map((link, index) =>
            <button key={index} onClick={() => this.pageChanged(link.url)} dangerouslySetInnerHTML={{ __html: link.label }} className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:z-10 focus:outline-none focus:ring ring-gray-300 focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150 first:rounded-l-md last:rounded-r-md" />
        );
    }

    renderCategoryFilter() {
        const categories = this.state.categories.map(category =>
            < option key={category.id} value={category.id} > {category.name}</option >
        );

        return (
            <select onChange={this.categoryChanged}
                className="mt-1 w-full sm:mt-0 sm:w-1/4 rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <option>-- all categories --</option>
                {categories}
            </select>
        )
    }

    orderColumnIcon(column) {
        let icon = 'fa-sort';
        if (this.state.query.order_column === column) {
            if (this.state.query.order_column === 'asc') {
                icon = 'fa-sort-up';
            } else {
                icon = 'fa-sort-down'
            }

        }

        return (
            <i className={`fa-solid ${icon}`} ></i >
        )
    }

    orderChanged(column) {

        let direction = 'asc';
        if (column === this.state.query.order_column) {
            direction = this.state.query.order_direction === 'asc' ? 'desc' : 'asc'
        }
        this.setState((
            {
                query: {
                    page: 1,
                    order_column: column,
                    order_direction: direction
                }
            }
        ), () => this.fetchPosts())
    }



    render() {
        if (!('data' in this.state.posts)) return;

        return (
            <div className="overflow-hidden overflow-x-auto p-6 bg-white border-gray-200">
                <div className="min-w-full align-middle">
                    <div className='mb-4'>
                        {this.renderCategoryFilter()}
                    </div>
                    <table className="table">
                        <thead className="table-header">
                            <tr>
                                <th>
                                    <div>
                                        <span>ID</span>
                                        <button onClick={() => this.orderChanged('id')} type="button" className="column-sort">
                                            {this.orderColumnIcon('id')}
                                        </button>
                                    </div>
                                </th>
                                <th>
                                    <div>
                                        <span>Title</span>
                                        <button onClick={() => this.orderChanged('title')} type="button" className="column-sort">
                                            {this.orderColumnIcon('title')}
                                        </button>
                                    </div>
                                </th>
                                <th>
                                    <div>
                                        <span>Category</span>
                                    </div>
                                </th>
                                <th>
                                    <div>
                                        <span>Content</span>
                                    </div>
                                </th>
                                <th>
                                    <div>
                                        <span>Created at</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {this.renderPosts()}
                        </tbody>
                    </table>
                    <div className='mt-4'>
                        {this.renderPaginator()}
                    </div>
                </div>
            </div>
        );
    }
}
export default PostsIndex
