import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import GeneralSettings from 'pages/settings/general-settings';
import UserList from 'pages/settings/user-settings/user-list';
import RoleList from 'pages/settings/user-settings/role-list';
import Default from 'pages/default';
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/Dashboard';
import OrderList from 'pages/orders/orders-list';
import ProductsList from 'pages/products/products-list';
import CustomersList from 'pages/customers/customers-list';
import BusinessList from 'pages/customers/business-list';
import EmployeesList from 'pages/employees/employees-list';
import DepartmentsList from 'pages/employees/departments-list';
import OrderAdd from 'pages/orders/orders-add';
import OrderDetail from 'pages/orders/orders-detail';
import OrderUpdate from 'pages/orders/orders-update';
import SelectProduct from 'pages/orders/select-product';
import CreateProduct from 'pages/orders/create-product';
import CustomersAdd from 'pages/customers/customers-add';
import CustomersDetail from 'pages/customers/customers-detail';
import CustomersUpdate from 'pages/customers/customers-update';
import CustomersAddress from 'pages/customers/customers-address';
import EmployeesAdd from 'pages/employees/employees-add';
import EmployeesAddress from 'pages/employees/employees-address';
import ProductDetail from 'pages/orders/product-detail';
import UpdateProduct from 'pages/orders/update-product';
import DeliveryPrint from 'pages/orders/delivery-print';
import WorkForm from 'pages/orders/work-form';
import OrderForm from 'pages/orders/order-form';
import StockList from 'pages/stock/stock-list';
import MaterialList from 'pages/stock/material-list';
import SemiFinishedList from 'pages/stock/semi-finished-list';
import MonthlyStat from 'pages/stats/monthly-stats';
import YearlyStats from 'pages/stats/yearly-stats';
import GeneralStats from 'pages/stats/general-stats';


const ErrorPage = Loadable(lazy(() => import('pages/error-pages/404')));

const MainRoutes = {
  path: '/',
  children: [
    {
      element: <AuthGuard><MainLayout /></AuthGuard>,
      children: [
        {
          path: '/default',
          url: '/default',
          index: true,
          element: <Default />
        },
        {
          path: '/orders',
          children: [
            {
              path: 'list',
              element: <OrderList />
            },
            {
              path: 'add',
              element: <OrderAdd />
            },
            {
              path: 'detail/:id',
              element: <OrderDetail />
            },
            {
              path: 'detail/select-product/:id',
              element: <SelectProduct />
            },
            {
              path: 'detail/product-detail/:id',
              element: <ProductDetail />
            },
            {
              path: 'detail/create-product/:id/:id',
              element: <CreateProduct />
            },
            {
              path: 'detail/update-product/:id/:id',
              element: <UpdateProduct />
            },
            {
              path: 'update/:id',
              element: <OrderUpdate />
            },
            {
              path: 'delivery-list-print',
              element: <DeliveryPrint />
            },
            {
              path: 'work-form/:id',
              element: <WorkForm />
            },
            {
              path: 'order-form/:id',
              element: <OrderForm />
            },
          ]
        },
        {
          path: '/products',
          children: [
            {
              path: 'list',
              element: <ProductsList />
            },
          ]
        },
        {
          path: '/stats',
          children: [
            {
              path: 'monthly',
              element: <MonthlyStat />
            },
            {
              path: 'yearly',
              element: <YearlyStats />
            },
            {
              path: 'general',
              element: <GeneralStats />
            },
            
          ]
        },
        {
          path: '/stock',
          children: [
            {
              path: 'stock-list',
              element: <StockList />
            },
            {
              path: 'material-list',
              element: <MaterialList />
            },
            {
              path: 'semi-finished-list',
              element: <SemiFinishedList />
            },
          ]
        },
        {
          path: '/customers',
          children: [
            {
              path: 'list',
              element: <CustomersList />
            },
            {
              path: 'business',
              element: <BusinessList />
            },
            {
              path: 'add',
              element: <CustomersAdd />
            },
            {
              path: 'detail/:id',
              element: <CustomersDetail />
            },
            {
              path: 'update/:id',
              element: <CustomersUpdate />
            },
            {
              path: 'addresses/:id',
              element: <CustomersAddress />
            },
          ]
        },
        {
          path: '/employees',
          children: [
            {
              path: 'list',
              element: <EmployeesList />
            },
            {
              path: 'departments',
              element: <DepartmentsList />
            },
            {
              path: 'add',
              element: <EmployeesAdd />
            },
            {
              path: 'addresses/:id',
              element: <EmployeesAddress />
            },
          ]
        },
        {
          path: '/settings',
          children: [
            {
              path: 'general-settings',
              element: <GeneralSettings />
            },
            {
              children: [
                {
                  path: 'user-list',
                  element: <UserList />
                },
                {
                  path: 'role-list',
                  element: <RoleList />
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '*',
      element: <ErrorPage />
    }
  ]
};

export default MainRoutes;
