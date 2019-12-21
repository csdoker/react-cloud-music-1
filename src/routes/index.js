import React from 'react'
import { Redirect } from 'react-router-dom'
import Home from '../view/Home'
import Recommend from '../view/Recommend';
import Singers from '../view/Singers';
import Rank from '../view/Rank';

export default [
  {
    path: '/',
    component: Home,
    routes: [
      {
        path: "/",
        exact: true,
        render: () => (
          <Redirect to={"/recommend"}/>
        )
      },
      {
        path: "/recommend",
        component: Recommend
      },
      {
        path: "/singers",
        component: Singers
      },
      {
        path: "/rank",
        component: Rank
      }
    ]
  }
]