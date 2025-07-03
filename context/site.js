"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "@/utils/axios";
import { getCookie, setCookie } from "cookies-next";
import AuthContext from "@/context/auth";
import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  setEncodedCookie,
  decodeCookieValue,
  getDecodedCookie,
} from "@/utils/encoding";
import { useSocket } from "@/hooks/useSocket";

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [userSite, setUserSite] = useState();
  const [reports, setReports] = useState();
  const [allUsers, setAllUsers] = useState();
  const [loading, setLoading] = useState(false);
  const [iframReload, setIframReload] = useState(0);
  const [error, setError] = useState(null);
  const { userData } = useContext(AuthContext);
  const [site, setSite] = useState();
  // const socket = useSocket(userData?._id);
  // const socket = useSocket(userData?._id);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sites/site/id`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setItems(data.links.sort((a, b) => a.index - b.index));
      localStorage.setItem("userSite", JSON.stringify(data));
      setUserSite(JSON.parse(localStorage.getItem("userSite")));
    } catch (error) {
      console.error(error, "here");
    }
  };

  const getAllUsers = async (page = 1, limit = 10, filters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters,
      }).toString();
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/allusers${queryParams}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setAllUsers(data);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const getSite = async (slug) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sites/slug/${slug}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setSite(data);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const createSite = async (formData) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sites/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setLoading(false);
      // setCookie("registerSteps", data.registerSteps);
      // router.push("/admin");
    } catch (error) {
      toast.error(error);

      setLoading(false);
      setError(error);
    }
  };

  const updateSite = async (formData) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sites/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (socket?.connected) {
        socket.emit("site:update", {
          type: "SITE_UPDATE",
          payload: {
            siteId: data._id,
            updates: formData,
            site: data,
          },
        });
      }

      setSite(data);
      setLoading(false);
      router.push(`/admin`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while updating the site";
      toast.error(errorMessage);
      setLoading(false);
      setError(error);
    }
  };

  const addClicks = async (id) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/links/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
    } catch (error) {}
  };

  const updateUser = async (registerSteps) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/updateuser`,
        registerSteps,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setLoading(false);
      setCookie("registerSteps", data.registerSteps);
      router.push("/admin");
    } catch (error) {
      toast.error(error);

      setLoading(false);
      setError(error);
    }
  };

  const newHeader = async (header) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/headers/new`,
        {
          title: header,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const addToSite = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sites/addHeaders`,
        {
          headers: data._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setItems((prev) => [...items, data]);
      console.log(items);
    } catch (error) {
      console.log(error);
    }
  };

  const newLink = async (url, type) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sites/addLinks`,
        {
          url: url,
          type,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      fetchData();
      // const addToSite = await axios.put(
      //   `${process.env.NEXT_PUBLIC_BASE_URL}/sites/addLinks`,
      //   {
      //     links: data._id,
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     withCredentials: true,
      //   }
      // );

      setItems((prev) => [...items, data]);
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/links/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const { data: removeFromSites } = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sites/remove`,
        {
          data: { itemId: id },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const removed = items.filter((item) => item._id !== id);

      setItems((prev) => [...removed]);
    } catch (error) {
      console.log(error);
    }
  };

  const reorder = async (updatedItems) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sites/reorder`,
        {
          links: updatedItems.map((item, index) => ({
            id: item.id,
            index: index, // New index based on the order in the array
          })),
        }
      );

      if (socket?.connected) {
        socket.emit("site:reorder", {
          type: "SITE_REORDER",
          payload: {
            siteId: site._id,
            updates: formData,
            links: updatedItems.map((item, index) => ({
              id: item.id,
              index: index, // New index based on the order in the array
            })),
          },
        });
      }

      console.log("Order updated in backend", response.data);
    } catch (error) {
      console.error("Error updating order in backend", error);
    }
  };

  const updateBackend = useCallback(async (updatedItems) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sites/reorder`,
        {
          links: updatedItems.map((item, index) => ({
            id: item._id,
            index: index,
          })),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Order updated in backend", response.data);
    } catch (error) {
      console.error("Error updating order in backend", error);
    }
  }, []);

  const getReports = async () => {
    try {
      // Log the data being sent

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reports/get`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      // toast.error(error);
      console.log("Error updating reports:", error);

      setLoading(false);
    }
  };
  const updateReports = async (slug) => {
    try {
      console.log("Sending request with:", site); // Log the data being sent

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reports/update`,
        { slug: slug },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Response received:", data);
    } catch (error) {
      // toast.error(error);
      console.log("Error updating reports:", error);

      setLoading(false);
      setError(error);
    }
  };

  return (
    <SiteContext.Provider
      value={{
        setItems,
        items,
        fetchData,
        newHeader,
        newLink,
        remove,
        reorder,
        error,
        loading,
        createSite,
        updateSite,
        setUserSite,
        userSite,
        updateUser,
        setLoading,
        getSite,
        site,
        setSite,
        iframReload,
        updateBackend,
        setIframReload,
        updateReports,
        getReports,
        reports,
        setReports,
        addClicks,
        getAllUsers,
        allUsers,
        setAllUsers,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export default SiteContext;
