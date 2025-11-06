import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api`,
    credentials: "include",
  }),
  tagTypes: ["EVENT"],
  endpoints: (builder) => ({
    getMyEvents: builder.query({
      query: () => ({
        url: "/events",
      }),
      providesTags: ["EVENT"],
    }),
    createEvent: builder.mutation({
      query: (data) => ({
        url: "/events",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["EVENT"],
    }),
    updateEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}/swappable`,
        method: "PATCH",
      }),
      invalidatesTags: ["EVENT"],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EVENT"],
    }),

    //swap apis
    getSwappableSlots: builder.query({
      query: () => ({
        url: "/swappable-slots",
      }),
      providesTags: ["EVENT"],
    }),
    createSwapRequest: builder.mutation({
      query: (data) => ({
        url: "/swap-request",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["EVENT"],
    }),
    swapRequestResponse: builder.mutation({
      query: ({ requestId, data }) => ({
        url: `/swap-response/${requestId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["EVENT"],
    }),
    getMySwapRequests: builder.query({
      query: () => ({
        url: "/swap-requests",
      }),
      providesTags: ["EVENT"],
    }),
  }),
});

export default api;

export const {
  useGetMyEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,

  //swap mutation/queries
  useCreateSwapRequestMutation,
  useGetSwappableSlotsQuery,
  useSwapRequestResponseMutation,
  useGetMySwapRequestsQuery,
} = api;
