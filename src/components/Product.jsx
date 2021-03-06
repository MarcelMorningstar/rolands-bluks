import React from 'react';
import Context from '../Layouts/Layout';
import Attributes from '../widgets/Attributes';
import styled from 'styled-components';
import { Interweave } from 'interweave';

const Wrapper = styled.section`
  display: flex;
  justify-content: center;
  gap: 100px;
  padding: 60px 0;
`;

const Gallery = styled.section`
  display: flex;
  flex-direction: row-reverse;
  column-gap: 30px;
`;

const Images = styled.div`
  overflow-y: overlay;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  max-height: 400px;
  padding-left: 10px;
  direction: rtl;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(201, 201, 201, 0.6);
    border-radius: 25px;
    border: 0 transparent solid;
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(201, 201, 201, 0.75);
    border: 0 transparent solid;
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-thumb:active {
    background: rgba(201, 201, 201, 0.9);
    border: 0 transparent solid;
    background-clip: padding-box;
  }
`;

const ImageButton = styled.input`
  width: 80px;
  height: 80px;
  border: none;
  cursor: pointer;
  object-fit: contain;
`;

const Image = styled.img`
  max-height: 400px;
  object-fit: contain;
`;

const Info = styled.section`
  div {
    width: 300px;
    margin: 0 0 16px 0;
  }
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: ${props => props.weight || 400};
  line-height: 40px;
`;

const Label = styled.label`
  font-weight: 700;
  font-size: 18px;
  line-height: 18px;
  text-transform: uppercase;
`;

const Price = styled.span`
  display: block;
  margin: 16px 0 0 0;
  font-size: 24px;
  font-weight: 700;
`;

const AddButton = styled.button`
  display: block;
  width: 100%;
  margin: 24px 0;
  padding: 16px 32px;
  color: var(--c-white);  
  font-size: 16px;
  font-weight: 700;
  background-color: ${props => props.disabled ? 'var(--c-negative)' : 'var(--c-primary)'};
  border: none;
  cursor: pointer;

  &:hover {
    box-shadow: ${props => props.disabled ? 'none' : '0px 4px 8px rgba(168, 172, 176, 0.5)'};
  }
`;

export default class Item extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props)
    this.state = {
      img: this.props.images[0],
      attribute: [],
      setAttribute: (id, itemID, value) => {
        for (let i = 0; i < this.state.attribute.length; i++) {
          if (this.state.attribute[i].id === id) {
            this.state.attribute[i].items.id = itemID;
            this.state.attribute[i].items.value = value;
          }
        }
      }
    }
  }

  componentDidMount() {
    let attribute = [];

    for (let i = 0; i < this.props.attributes.length; i++) {
      attribute.push({
        "id": this.props.attributes[i].id,
        "items": {
          "id": null,
          "value": null
        }
      });
    }

    this.setState({ attribute: attribute });
  }

  changeImage = (e) => {
    this.setState({ img: e.target.value });
  }

  handleAttribute = (type, id, value) => {
    this.state.setAttribute(type, id, value);
  }

  addProduct = () => {
    let attributes = true;

    for (let i = 0; i < this.state.attribute.length; i++) {
      if (this.state.attribute[i].items.value === null) {
        attributes = false;
      }
    }

    if (attributes) {
      let same = false;
      let index;
      let item = {
        "id": this.props.id,
        "price": this.props.price,
        "prices": this.props.prices,
        "quantity": 1,
        "product": {
          "id": this.props.id,
          "attribute": this.state.attribute
        }
      }

      if (item.product.attribute.length === 0) {
        for (let i = 0; i < this.context.items.length; i++) {
          if (this.context.items[i].id === item.id) {
            same = true;
            index = i;
            break;
          } else {
            same = false;
          }
        }
      } else {
        for (let i = 0; i < this.context.items.length; i++) {
          if (this.context.items[i].id === item.id && !same) {
            for (let j = 0; j < item.product.attribute.length; j++) {
              if (item.product.attribute[j].items.id === this.context.items[i].product.attribute[j].items.id) {
                same = true;
                index = i;
              } else {
                same = false;
                break;
              }
            }
          }
        }
      }

      if (!same) {
        this.context.addItem(item);
      } else {
        this.context.updateItem(index, item.quantity);
      }

      this.context.updateBag(item.quantity, item.price);
    } else {
      alert("choose attributes");
    }
  }

  render() {
    return (
      <Wrapper>
        <Gallery>
          <Image src={this.state.img} alt=""/>
          <Images>
            {
              this.props.images.map((image, index) => 
                <ImageButton type="image" key={index} src={image} onClick={this.changeImage} value={image} />
              )
            }
          </Images>
        </Gallery>
        <Info>
          <div>
            <Title id='brand' weight={600}>{this.props.brand}</Title>
            <Title id='name'>{this.props.name}</Title>
          </div>
          <Attributes attributes={this.props.attributes} attribute={null} handleAttribute={this.handleAttribute} disabled={false} Sheight={32} Theight={45} />
          <div id='price'>
            <Label>PRICE:</Label>
            <Price>{this.props.currency + this.props.price.toFixed(2)}</Price>
            <AddButton 
              onClick={this.addProduct}
              disabled={!this.props.inStock}
            >{this.props.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}</AddButton>
          </div>
          <div>
            <Interweave content={this.props.description} />
          </div>
        </Info>
      </Wrapper>
    )
  }
}
