from typing import List, Optional
from uuid import UUID
from models.Log import Log
from services.connect_db import supabase
from fastapi import APIRouter, HTTPException, Depends, Request, UploadFile, File, Form
# from services.connect_db import supabase


class LogDAO:
    def __init__(self):
        self.database = supabase

    def get_by_id(self, id):
        try:
            interaction_response = (
            self.database
            .from_("logs")
            .select("relationship_id")
            .eq("log_id", id)
            .single()
            .execute()
        )
            return interaction_response   
        except:
            return ''


    def get_by_relationship_id(self, relationship_id: UUID) -> List[Log]:
        try:
            interactions_response = (
                self.database
                .from_("logs")
                .select("*")
                .eq("relationship_id", relationship_id)
                .order("date", desc=True)
                .execute()
            )
            return interactions_response
        except:
            return ''

    def create(self, log: Log) -> None:
        """
        Create a new log.
        """
        # Insert into database

        try:
            insert_response = (
                self.database
                .from_("logs")
                .insert(log)
                .execute()
            )

            return insert_response
        except:
            return ''

    def update(self, data, id):
        """
        Update an existing log.
        """
        # Step 2: Update the log
        try:
            update_response = (self.database
            .from_("logs")
            .update(data)
            .eq("log_id", id)
            .execute())

            return update_response
        except:
            return ''

        # if not update_response.data:
        #     raise HTTPException(status_code=500, detail="Failed to create log"

    def delete(self, log_id: UUID) -> None:
        """
        Delete a log by its ID.
        """
        try:
            delete_response = (
                self.database
                .from_("logs")
                .delete()
                .eq("log_id", log_id)
                .execute()
            )

            return delete_response
        except:
            return ''