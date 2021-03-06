import React from 'react';
import Context from '../Layouts/Layout';
import { Query } from "@apollo/client/react/components";
import { GetProducts } from '../queries';
import ProductCard from '../components/ProductCard';
import Loading from '../Layouts/Loading';
import '../styles/category.scss';

export default class Category extends React.Component {
  static contextType = Context;

  render() {
    return (
      <section className='category'>
        <div className='wrapper'>
          <section className='products'>
            <h1>{this.props.match.params.category}</h1>

            <Query query={GetProducts} variables={{category: this.props.match.params.category}}>
              {({ data, loading, error }) => {
                if (loading) return <Loading />;
                if (error) return console.log('Something went wrong');

                return (
                  data.category.products.map((product) => 
                    <ProductCard 
                      key={product.id}
                      id={product.id}
                      name={product.name} 
                      brand={product.brand}
                      image={product.gallery[0]}
                      attributes={product.attributes}
                      currency={product.prices[this.context.bag.currency].currency.symbol}
                      price={product.prices[this.context.bag.currency].amount}
                      prices={product.prices}
                      inStock={product.inStock}
                    /> 
                  )
                );
              }}
            </Query>
          </section>
        </div>
      </section>
    )
  }
}
