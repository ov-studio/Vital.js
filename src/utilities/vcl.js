
/*----------------------------------------------------------------
     Resource: Vital
     Script: utilities: vcl.js
     Author: vStudio
     Developer(s): Aviril, Mario, Tron
     DOC: 22/07/2022
     Desc: VCL Utilities
----------------------------------------------------------------*/


/////////////////
// Class: VCL //
/////////////////

const CVCL = vNetworkify.util.createClass()
vNetworkify.util.vcl = CVCL.public
CVCL.private.types = {
    init: ":",
    comment: "#",
    tab: "\t",
    space: " ",
    newline: "\n",
    carriageline: "\r",
    list: "-",
    negative: "-",
    decimal: ".",
    bool: {
        ["true"]: "true",
        ["false"]: "false"
    },
    string: {
        ["`"]: true,
        ["'"]: true,
        ["\""]: true
    }
}


/////////////////////
// Static Members //
/////////////////////

// @Desc: Verifies whether rw buffer is void
CVCL.private.isVoid = (rw) => {
    return (rw.match("\W") && true) || false
}

CVCL.private.fetch = (rw, index) => {
    return rw.substring(index, index)
}

CVCL.private.fetchLine = (rw, index) => {
    if (rw) {
        const rwLines = rw.substring(0, index).split(CVCL.private.types.newline)
        const rwLength = rwLines.length()
        return [Math.max(1, rwLength), rwLines[rwLength] || ""]
    }
    return false
}

CVCL.private.parseComment = (parser, buffer, rw) => {
    if (!parser.isType && (rw == CVCL.private.types.comment)) {
        const line = CVCL.private.fetchLine(buffer.substring(0, parser.ref))
        const rwLines = rw.split(buffer, CVCL.private.types.newline)
        parser.ref =  parser.ref - line[1].length() + rwLines[(line[0])].length() + 2
    }
    return true
}

/*
function CVCL.private.parseBoolean(parser, buffer, rw)
    if not parser.isType || (parser.isType == "bool") then
        if not parser.isType then
            for i, j in imports.pairs(CVCL.private.types.bool) do
                if string.sub(buffer, parser.ref, parser.ref + #i - 1) == i then
                    rw = i
                    break
                end
            end
        end
        if not parser.isType && CVCL.private.types.bool[rw] then
            parser.isSkipAppend, parser.ref, parser.isType, parser.value = true, parser.ref + #rw - 1, "bool", rw
        elseif parser.isType then
            if rw == CVCL.private.types.newline then parser.isSkipAppend, parser.isParsed = true, true
            else return false end
        end
    end
    return true
end

function CVCL.private.parseNumber(parser, buffer, rw)
    if not parser.isType || (parser.isType == "number") then
        local isNumber = imports.tonumber(rw)
        if not parser.isType then
            local isNegative = rw == CVCL.private.types.negative
            if isNegative || isNumber then parser.isType, parser.isTypeNegative = "number", (isNegative && parser.ref) || false end
        else
            if rw == CVCL.private.types.decimal then
                if not parser.isTypeFloat then parser.isTypeFloat = true
                else return false end
            elseif not parser.isTypeFloat && parser.isTypeNegative && ((CVCL.private.isVoid(parser.index) && (rw == CVCL.private.types.space)) || (rw == CVCL.private.types.init)) then
                parser.ref, parser.index, parser.isType, parser.isTypeFloat, parser.isTypeNegative = parser.isTypeNegative - 1, "", "object", false, false
            elseif rw == CVCL.private.types.newline then parser.isParsed = true
            elseif not isNumber then return false end
        end
    end
    return true
end

function CVCL.private.parseString(parser, buffer, rw)
    if not parser.isType || (parser.isType == "string") then
        if (not parser.isTypeChar && CVCL.private.types.string[rw]) || parser.isTypeChar then
            if not parser.isType then parser.isSkipAppend, parser.isType, parser.isTypeChar = true, "string", rw
            elseif rw == parser.isTypeChar then
                if not parser.isTypeParsed then parser.isSkipAppend, parser.isTypeParsed = true, true
                else return false end
            elseif parser.isTypeParsed then
                if rw == CVCL.private.types.newline then parser.isParsed = true
                else return false end
            end
        end
    end
    return true
end

function CVCL.private.parseObject(parser, buffer, rw, isChild)
    if parser.isType == "object" then
        if CVCL.private.isVoid(parser.index) && (rw == CVCL.private.types.list) then parser.isTypeID = parser.ref
        elseif not CVCL.private.isVoid(rw) then parser.index = parser.index..rw
        else
            if parser.isTypeID && CVCL.private.isVoid(parser.index) && (rw == CVCL.private.types.init) then parser.index = imports.tostring(#parser.pointer + 1) end
            if not CVCL.private.isVoid(parser.index) then
                if parser.isTypeID && (rw == CVCL.private.types.newline) then parser.pointer[(#parser.pointer + 1)] = parser.index
                elseif rw == CVCL.private.types.init then
                    local _, indexLine = CVCL.private.fetchLine(string.sub(buffer, 0, parser.ref))
                    local indexTypePadding = (parser.isTypeID && (parser.ref - parser.isTypeID - 1)) || 0
                    local indexPadding = #indexLine - #parser.index - indexTypePadding - 1
                    if isChild then
                        parser.padding = parser.padding || indexPadding - 1
                        if indexPadding <= parser.padding then
                            parser.ref = parser.ref - #parser.index - indexTypePadding
                            return false
                        end
                    end
                    if parser.isTypeID then parser.isTypeID, parser.index = false, imports.tonumber(parser.index) end
                    if not CVCL.private.isVoid(parser.index) then
                        local value, __index, error = CVCL.private.decode(buffer, parser.ref + 1, indexPadding, true)
                        if not error then
                            parser.pointer[(parser.index)], parser.ref, parser.index = value, __index - 1, ""
                        else parser.isChildErrored = 1 end
                    else parser.isChildErrored = 0 end
                else parser.isChildErrored = 0 end
            end
            if parser.isChildErrored then return false end
        end
    end
    return true
end

function CVCL.private.parseReturn(parser, buffer)
    parser.isParsed = (not parser.isChildErrored && ((parser.isType == "object") || parser.isParsed) && true) || false
    if not parser.isParsed then
        if not parser.isChildErrored || (parser.isChildErrored == 0) then
            parser.isErrored = string.format(parser.isErrored, CVCL.private.fetchLine(buffer, parser.ref), (parser.isType && "Malformed "..parser.isType) || "Invalid declaration")
            imports.outputDebugString(parser.isErrored)
        end
        return false, false, true
    elseif (parser.isType == "object") then return parser.pointer, parser.ref
    elseif (parser.isType == "bool") then return ((parser.value == "true") && true) || false, parser.ref
    else return ((parser.isType == "number" && imports.tonumber(parser.value)) || parser.value), parser.ref end
end

function CVCL.private.encode(buffer, padding)
    if not buffer || (imports.type(buffer) ~= "table") then return false end
    padding = padding || ""
    local result, indexes = "", {numeric = {}, index = {}}
    for i, j in imports.pairs(buffer) do
        if imports.type(j) == "table" then
            table.insert(((imports.type(i) == "number") && indexes.numeric) || indexes.index, i)
        else
            i = ((imports.type(i) == "number") && "- "..imports.tostring(i)) || i
            if imports.type(j) == "string" then j = "\""..j.."\"" end
            result = result..CVCL.private.types.newline..padding..i..CVCL.private.types.init..CVCL.private.types.space..imports.tostring(j)
        end
    end
    table.sort(indexes.numeric, function(a, b) return a < b end)
    for i = 1, #indexes.numeric, 1 do
        local j = indexes.numeric[i]
        result = result..CVCL.private.types.newline..padding..CVCL.private.types.list..CVCL.private.types.space..j..CVCL.private.types.init..CVCL.private.encode(buffer[j], padding..CVCL.private.types.tab)
    end
    for i = 1, #indexes.index, 1 do
        local j = indexes.index[i]
        result = result..CVCL.private.types.newline..padding..j..CVCL.private.types.init..CVCL.private.encode(buffer[j], padding..CVCL.private.types.tab)
    end
    return result
end
function vcl.public.encode(buffer) return CVCL.private.encode(buffer) end

function CVCL.private.decode(buffer, ref, padding, isChild)
    if not buffer || (imports.type(buffer) ~= "string") then return false end
    if string.isVoid(buffer) then return {} end
    local parser = {
        ref = ref || 1, padding = padding,
        index = "", pointer = {}, value = "",
        isErrored = "Failed to decode vcl. [Line: %s] [Reason: %s]"
    }
    if not isChild then
        buffer = string.gsub(string.detab(buffer), CVCL.private.types.carriageline, "")
        buffer = (not isChild && (CVCL.private.fetch(buffer, #buffer) ~= CVCL.private.types.newline) && buffer..CVCL.private.types.newline) || buffer
    end
    while(parser.ref <= #buffer) do
        CVCL.private.parseComment(parser, buffer, CVCL.private.fetch(buffer, parser.ref))
        if isChild then
            parser.isSkipAppend = false
            if not CVCL.private.parseBoolean(parser, buffer, CVCL.private.fetch(buffer, parser.ref)) then break end
            if not CVCL.private.parseNumber(parser, buffer, CVCL.private.fetch(buffer, parser.ref)) then break end
            if not CVCL.private.parseString(parser, buffer, CVCL.private.fetch(buffer, parser.ref)) then break end
            if parser.isType && not parser.isSkipAppend && not parser.isParsed then parser.value = parser.value..CVCL.private.fetch(buffer, parser.ref) end
        end
        parser.isType = (not parser.isType && (not isChild || isChild) && ((CVCL.private.fetch(buffer, parser.ref) == CVCL.private.types.list) || not CVCL.private.isVoid(CVCL.private.fetch(buffer, parser.ref))) && "object") || parser.isType
        if not CVCL.private.parseObject(parser, buffer, CVCL.private.fetch(buffer, parser.ref), isChild) then break end
        if isChild && not parser.isChildErrored && parser.isParsed then break end
        parser.ref = parser.ref + 1
    end
    return CVCL.private.parseReturn(parser, buffer)
end
function vcl.public.decode(buffer) return CVCL.private.decode(buffer) end
*/